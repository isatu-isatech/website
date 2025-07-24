# Running the Development Server

You've got the project files and all the necessary dependencies installed. Now, let's fire up the development server so you can see the website and start working on it!

1. Open your Terminal/Command Prompt or VS Code's Integrated Terminal:
   * If you're using a standalone terminal: Make sure you are inside your project's main folder (the one containing `package.json`). If not, `cd` into it.
   * If you're using Visual Studio Code: This is often the easiest way! Open your project folder in VS Code (`File > Open Folder...`). Then, go to the top menu and click `Terminal > New Terminal`. This will open a terminal panel right inside VS Code, automatically set to your project's main folder.
2.  Start the development server: In your chosen terminal (whether it's standalone or integrated in VS Code), run one of the following commands:

    *   Using npm:

        ```bash
        npm run dev
        ```
    *   Using Yarn:

        ```bash
        yarn dev
        ```
    *   Using pnpm:

        ```bash
        pnpm dev
        ```

    This command will start the Next.js development server. You'll see some messages in your terminal, and it will usually tell you that the server is ready, often showing something like `ready - started server on 0.0.0.0:3000, url: http://localhost:3000`.
3.  Open the website in your browser: Once the server is running, open your web browser (like Chrome, Firefox, Edge, etc.) and go to this address:

    ```
    http://localhost:3000
    ```

    You should now see the isatech website!

That's it! The website is now running locally on your computer. A cool thing about the Next.js development server is that as you make changes to the code in your editor (like VS Code), your browser will automatically refresh, letting you see your updates instantly without manually reloading.

