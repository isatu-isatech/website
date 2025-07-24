# Installing Project Dependencies

After cloning the repository, the next step is to install all the necessary packages and libraries that your Next.js project relies on. This is usually a one-time setup process.

1. Open your Terminal or Command Prompt:
   * If you closed it, open it again.
   * If you're still in the project folder from the ["Getting the Project Files"](getting-the-project-files.md) step, that's perfect!
2.  Navigate to your project's main folder: If you're not already there, use the `cd` command to get into the root directory of your cloned project. This is the folder that contains files like `package.json`.

    Bash

    ```bash
    cd website
    ```

    _Make sure you're inside this folder before proceeding!_
3. Install the dependencies: Now, run one of the following commands, depending on which package manager you prefer or if you saw `yarn.lock` or `pnpm-lock.yaml` in the project files.
   *   Using npm (Node Package Manager - most common):

       Bash

       ```
       npm install
       ```

       _This command reads the `package.json` file and downloads all the listed dependencies._
   *   Using Yarn:

       Bash

       ```
       yarn install
       ```

       _If you prefer Yarn or see a `yarn.lock` file, use this._
   *   Using pnpm:

       Bash

       ```
       pnpm install
       ```

       _If you're using pnpm or see a `pnpm-lock.yaml` file, use this._

Wait for the process to complete. You'll see a lot of text scroll by as the packages are downloaded and installed. Once it's done, you're ready to start the development server!

