const core = require('@actions/core')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const apiKey = core.getInput('api_key', { required: true })
    const repoURL = core.getInput('repo_url', { required: true })
    const refName = core.getInput('ref_name', { required: true })

    const services = core.getInput('services') || ''
    const timeStamp = core.getInput('time_stamp') || new Date().toISOString()
    const custom_stage = core.getInput('stage') || 'release'

    const serviceArray = services.split(',').map(item => item.trim())

    core.info(`Create LinearB release metrics for ${serviceArray}`)

    const url = 'https://public-api.linearb.io/api/v1/deployments'

    const body = {
      repo_url: repoURL,
      ref_name: refName,
      timestamp: timeStamp,
      stage: custom_stage
    }

    if (serviceArray.length > 0) {
      body.services = serviceArray
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(body)
    })

    if (response.status !== 200) {
      core.setFailed(`Request failed with status ${response.status}`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
