# Mobile App Screenshot Generator

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjules%2Fscreenshot-generator)

A simple and intuitive tool for developers to quickly create stunning promotional images and screenshots for their mobile applications.

## Features

- **Carousel Generation**: Upload multiple screenshots to create a seamless carousel-style image.
- **Real-time Preview**: Instantly see how your final image will look as you edit.
- **Customization**: Easily change the title and background color to match your app's branding.
- **High-Quality Export**: Download your generated screenshot as a high-resolution PNG file.
- **Responsive Design**: Works smoothly on desktop, tablet, and mobile devices.
- **Client-Side Processing**: All image processing is done in the browser, ensuring user data privacy and fast performance.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14+ (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Image Generation**: [html2canvas](https://html2canvas.hertzen.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jules/screenshot-generator.git
    cd screenshot-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application is optimized for deployment on [Vercel](https://vercel.com/), the platform from the creators of Next.js.

- Simply click the "Deploy with Vercel" button at the top of this README to deploy your own instance.
- No special environment variables are needed for the MVP version.

## How It Works

The application leverages the `html2canvas` library to capture a DOM element from the preview area and convert it into a PNG image. All processing is handled on the client-side, meaning user-uploaded images are not sent to a server.
