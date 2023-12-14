# Music Emotion Prediction Website

Welcome to the Music Emotion Prediction website! This platform allows users to upload songs, and our system will predict the emotion of the song using machine learning. The predicted emotions are then stored in playlists, and users can listen to their uploaded songs at any time on our website.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This website employs machine learning to analyze the emotional content of uploaded songs. Users can register, log in, upload their favorite songs, and listen th=hem when ever the want. The system predicts the emotion of each song and organizes them into playlists based on their emotional characteristics. Users can access and listen to their playlists whenever they want.

## Features

- **User Authentication:** Users can register and log in securely.
- **Song Upload:** Upload your favorite songs to the platform.
- **Emotion Prediction:** Utilizing machine learning, the system predicts the emotion of each uploaded song.
- **Playlist Creation:** Organize songs into playlists based on their predicted emotions.
- **User-Friendly Interface:** Easily navigate the website to explore and listen to uploaded songs.

## Tech Stack

- **Frontend:** EJS (Embedded JavaScript templates), Express.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Machine Learning:** Keras, librosa
- **File Storage:** Google Drive API
- **Other Libraries:** Multer, Googleapis, gdown

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jatingaur18/music.git
   cd music
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Create a `.env` file in the project root.
   - Define the following variables:
     ```
     DATABASE_URL=your_mongodb_connection_url
     PORT=your_preferred_port_number
     ```

4. Run the application:
   ```bash
   npm run devStart
   ```

## Usage

1. Visit the website and register/login.
2. Upload your favorite songs.
3. Explore the playlists organized by predicted emotions.
4. Listen to your uploaded songs at any time.

## Contributing

Contributions are welcome! If you have ideas for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code.

Happy listening! 🎶
