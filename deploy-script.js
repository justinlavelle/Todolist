const semver = require('semver')
const readPkg = require('read-pkg')
const writePkg = require('write-pkg')
const { exec: childExec } = require('child_process')
const git = require('simple-git')(process.cwd())
  .addConfig('user.name', 'Alexandre Charlot')
  .addConfig('user.email', 'acharlot91@gmail.com')

const CHANGELOG_ORDER = [
  'feat',
  'fix',
  'perf',
  'test',
  'refactor',
  'chore',
  'docs',
  'revert',
  'other',
]

function bump(previousVersion = '0.0.0', commits = {}) {
  const hasFeat = commits.feat && commits.feat.length > 0
  const bumpType = hasFeat ? 'minor' : 'patch'

  return { bumpType, newVersion: semver.inc(String(previousVersion), bumpType) }
}

function getVersion(tag) {
  const version = semver.coerce(tag)

  const [major, minor] = String(version).split('.')

  const minorVersion = `${major}.${minor}.0`
  const majorVersion = `${major}.0.0`

  return { version, minorVersion, majorVersion }
}

function exec(cmd) {
  return new Promise((resolve, reject) => {
    childExec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error, stderr)

        return
      }

      resolve({ stdout: stdout.trim(), stderr: stderr.trim() })
    })
  })
}

async function tags() {
  const gitTags = 'git tag --sort=-committerdate'
  try {
    const { stdout } = await exec(gitTags)
    if (!stdout) {
      return []
    }

    return stdout.split('\n') || []
  } catch (e) {
    console.error(`
      ${e}
      ${gitTags}
    `)

    throw e
  }
}

async function fetch() {
  const gitFetch = 'git fetch --tags'
  try {
    await exec(gitFetch)
  } catch (e) {
    console.error(`
    ${e}
    ${gitFetch}
    `)

    throw e
  }
}

function escape(str) {
  return str.replace(/'/g, `'\\''`)
}

async function diff({
  from,
  to = 'origin/master',
  format = '%h - %s - %an - %ae',
} = {}) {
  const gitLog = `git log --format='${escape(
    format,
  )}' --no-merges v${from}...${to}`
  try {
    const { stdout: logs = '' } = await exec(gitLog)

    return logs.split('\n')
  } catch (e) {
    console.error(`
      ${e}
      ${gitLog}
    `)

    throw e
  }
}

async function getCommits({ ...params } = {}) {
  const commits = {}

  try {
    const changes = await diff({ ...params })

    changes.forEach(commit => {
      const [shortHash, commitMessage] = commit.split(' - ')

      if (!commitMessage) {
        commits.other = commits.other || []
        commits.other.push(`* ${commit}`)

        return
      }

      let type = commitMessage.substring(0, commitMessage.indexOf('('))
      type = type === 'prefeat' ? 'feat' : type

      if (!CHANGELOG_ORDER.includes(type)) {
        type = 'other'
      }

      commits[type] = commits[type] || []
      commits[type].push(`* ${shortHash} - ${commitMessage}`)
    })
  } catch (e) {
    console.error(`
      ${e}
      ${params}
    `)

    throw e
  }

  return commits
}

async function prepare() {
  await fetch()

  const fetchedTags = await tags()
  const { version: previousVersion } = getVersion(fetchedTags[0])
  const commits = getCommits({
    from: String(previousVersion),
  })

  const { newVersion } = bump(previousVersion, commits)

  const data = await readPkg()
  delete data._id
  data.version = newVersion
  await writePkg(data)
  await git.add('package.json')
  await git.commit(`v${newVersion}`)
  await git.addTag(`v${newVersion}`)
  await git.push()
  await git.pushTags()
}

prepare()
