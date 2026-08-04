const core = require('@actions/core');
const exec = require('@actions/exec');

const validateBranchName = ({ branchName }) => 
    /^[a-zA-Z0-9_\/]+$/.test(branchName);

const validateDirectoryName = ({ dirName }) =>
    /^[a-zA-Z0-9_\/]+$/.test(dirName);

async function run() {

    const baseBranch = core.getInput('base-branch');
    const targetBranch = core.getInput('target-branch');
    const workingDirectory = core.getInput('working-directory');
    const ghToken = core.getInput('gh-token');
    const debug = core.getBooleanInput('debug');

    core.setSecret(ghToken);
    if (validateBranchName({ branchName: baseBranch })) {
        core.error(`Invalid base branch name: ${baseBranch}`);
    }

    if (validateBranchName({ branchName: targetBranch })) {
        core.error(`Invalid target branch name: ${targetBranch}`);
    }

    if (validateDirectoryName({ dirName: workingDirectory })) {
        core.error(`Invalid working directory name: ${workingDirectory}`);
    }

    core.info(`[js-dependency-update]:base branch is ${baseBranch}`);
    core.info(`[js-dependency-update]:target branch is ${targetBranch}`);
    core.info(`[js-dependency-update]:working directory is ${workingDirectory}`);

    await exec.exec('npm update', [], {
        cwd: workingDir
    });

    const gitStatus = await exec.getExecOutput('git status -s package*.json', [],{
        cwd: workingDir
    });

    if (gitStatus.stdout.length > 0) {
        core.info('[js-dependency-update]: There are updates available');
    } else {    
        core.info('[js-dependency-update]: No updates available');
    }

    /*
        1.  Parse inpts:
            1.1 base-branch from which to check for updates
            1.2 target-branch to use to create a PR
            1.3 Github Token for authentication purposes (to create PRs)
            1.4 Working directory for which to check for dependencies

        2. Execute the npm update command withing the working directory
        3. Check whether there are modified package*.json files
        4. If there are modified files, 
            4.1 Add and commit the files to the target-branch
            4.2 Create a PR to the base-branch using the actokit API
        5. Otherwise , conclude the custom actions
    */
    core.info('I am a custom js actions');
}

run()