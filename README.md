# SoloRPG

SoloRPG is an application designed for playing tabletop role-playing games without the need for a Game Master. Whether you want to embark on a complete adventure or just need a helper for your solo campaign.
It uses a Large Language Model (LLM) to generate adventures or any content the player might need, it use **Ollama** as the AI server.

## Installation Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/josete/SoloRpg.git
    ```

2. Navigate to the project directory:

    ```bash
    cd SoloRPG
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Usage

To use SoloRPG, you need to have **Ollama** installed and running. Follow these steps:

1. Ensure **Ollama** is installed on your system.
2. Start the **Ollama** server:

    ```bash
    ollama serve
    ```

3. Run the model you want:

    ```bash
    ollama run <model_name>
    ```

4. Run the application:

    ```bash
    npm run dev
    ```
    To expose the server:
    
    ```bash
    npm run dev -- --host
    ```

5. Enjoy you adventure!
