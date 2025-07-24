# Getting the Project Files

Once you have Git installed, it's time to get a copy of the project files onto your computer. You have two main ways to do this: using the command line (Git) or using the GitHub Desktop application. Choose whichever method you're most comfortable with!

{% tabs %}
{% tab title="Using the Command Line " %}
This method uses Git commands directly in your terminal. It's a common way for developers to manage code.

1. Open your Terminal or Command Prompt:
   1. On macOS/Linux: Search for "Terminal."
   2. On Windows: Search for "Command Prompt" or "PowerShell."
2.  Navigate to your preferred directory: Use the `cd` command to go to the folder where you want to save the project. For example:

    ```bash
    cd Documents/MyProjects
    ```

    _(Tip: If the folder doesn't exist yet, you can create it first with `mkdir MyProjects`.)_
3.  Clone the repository: Copy the project from GitHub by running this command:

    ```bash
    git clone https://github.com/isatu-isatech/website.git
    ```
4.  Move into the project folder: After cloning, a new folder named after your repository will be created. Go into it:

    ```bash
    cd website
    ```

You've successfully downloaded the project! Now, proceed to the "Installing Dependencies" section.
{% endtab %}

{% tab title="Using GitHub Desktop" %}
If you prefer a graphical interface and aren't as familiar with the command line, GitHub Desktop makes cloning super simple.

1. Download and Install GitHub Desktop:
   * If you don't have it already, download it from [desktop.github.com](https://desktop.github.com/) and follow the installation instructions.
2. Sign in to your GitHub account: Open GitHub Desktop and sign in with your GitHub credentials.
3. Clone the repository:
   * On the [GitHub repository page](https://github.com/isatu-isatech/website.git) in your web browser, click the green `< > Code` button.
   * Select the "Open with GitHub Desktop" option. (If you don't see this, try clicking "Local" then "Open with GitHub Desktop.")
   * GitHub Desktop will open and ask you where you want to save the project on your computer. Choose your desired location.
   * Click "Clone".
4. Open the repository: Once cloned, GitHub Desktop will show the project. You can then click "Open in \[your preferred editor]" (like Visual Studio Code) or simply navigate to the folder on your computer.

Great job! The project files are now on your machine. Head over to the "Installing Dependencies" section next.
{% endtab %}
{% endtabs %}

