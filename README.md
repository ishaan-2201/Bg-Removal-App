# Background Removal Application

## Overview

The Background Removal Application is a web-based tool that allows users to remove the background from images using the Clip Drop API. Users can upload images, process them to remove backgrounds, and download the results. To use this feature, credits are required, which can be purchased via Razorpay's payment integration.

## Features

- Upload Images: Users can upload images whose backgrounds they want to remove.

- Background Removal: Uses the Clip Drop API to process images and remove backgrounds.

- Download Processed Images: Users can download the output images after processing.

- Credits System: Each background removal requires credits, ensuring controlled usage.

- Buy Credits Page: Users can purchase credits through different plans using Razorpay payment integration.

- Multiple Plans: Various credit plans are available for purchase.

## Technologies Used

- Frontend: React.js

- Backend: Node.js, Express.js

- Database: MongoDB

- Third-Party APIs & Packages:

  - Clip Drop API: For background removal processing.

  - Razorpay API: For handling payments and transactions.

  - Multer: For handling image uploads on the server side.

## Deployment

The application is deployed on Vercel and can be accessed at:
[Live Demo](https://bg-removal-app-313v.vercel.app/)

## Usage

1. Home Page: Upload an image whose background needs to be removed.

2. Results Page: View the processed image with the background removed and download it.

3. Buy Credits Page: Purchase credits to continue using the background removal feature.

4. Payment Process:

- Select a credit plan.

- Use Razorpay integration for secure payments.

- Credits are added to the user's account upon successful payment.
