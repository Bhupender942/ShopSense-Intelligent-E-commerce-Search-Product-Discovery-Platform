# Flipkart Grid 7.0 Project

This is a Flipkart clone project with advanced search features including voice search and image search.

## Running the Project

1. Install dependencies:

```
npm install
```

2. Set up environment variables:

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/flipkart_grid
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/flipkart_grid

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Cookie Secret
COOKIE_SECRET=your-cookie-secret-here

# Optional: Ping message
PING_MESSAGE=pong

# Optional: Client URL for production
CLIENT_URL=http://localhost:5173
```

3. Start the development server:

```
npm run dev
```

4. Build for production:

```
npm run build
```

5. Start the production server:

```
npm start
```

## Features

### 🔍 **Advanced Search System**

- **Autosuggest with Trie Data Structure**: Fast prefix matching using in-memory Trie
- **Fuzzy Search**: Levenshtein distance for typo correction
- **Real-time Suggestions**: Debounced API calls with caching
- **Search Analytics**: Track search patterns and click-through rates
- **Category-based Filtering**: Context-aware suggestions

### 🎤 **Voice Search Feature**

The project includes a voice search feature that allows users to search for products using their voice. This feature uses the Web Speech API, which is supported in most modern browsers.

#### How to Use Voice Search

1. Click on the microphone icon next to the search bar.
2. Allow microphone access if prompted by your browser.
3. Speak your search query clearly.
4. The search will automatically execute once you stop speaking.

#### Browser Compatibility

The voice search feature works in the following browsers:

- Google Chrome (desktop and mobile)
- Microsoft Edge
- Safari (iOS 14.5+ and macOS)
- Firefox (with flag enabled)

### 📷 **Image Search Feature**

The project includes an advanced image search feature that allows users to upload images and find similar products.

#### How to Use Image Search

1. Click on the camera icon next to the search bar on the home page.
2. Upload an image by dragging and dropping or clicking to select.
3. Take a photo using your device camera (mobile devices).
4. Click "Search with this Image" to find similar products.
5. View results with the uploaded image displayed alongside products.

#### Image Search Features

- **Drag & Drop**: Simply drag an image file onto the upload area
- **File Selection**: Click to browse and select image files
- **Camera Capture**: Take photos directly on mobile devices
- **Multiple Formats**: Supports JPEG, PNG, GIF, and WebP formats
- **File Size Limit**: Maximum 5MB per image
- **Visual Feedback**: Real-time preview of uploaded images
- **Results Display**: Shows uploaded image alongside search results

#### Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

#### Image Search Implementation

The image search feature includes:

- **File Upload Handling**: Multer middleware for secure file uploads
- **Image Processing**: Server-side image validation and processing
- **Product Matching**: Simulated visual similarity matching
- **Results Display**: Integrated with the main search results page
- **Static File Serving**: Uploaded images are served statically

#### Technical Details

- **Frontend**: React components with drag-and-drop functionality
- **Backend**: Express.js with Multer for file uploads
- **Storage**: Local file system with unique filename generation
- **Security**: File type validation and size limits
- **Performance**: Optimized image serving and caching

### 🔐 **Authentication System**

- **JWT-based Auth**: Secure token-based authentication
- **HTTP-only Cookies**: XSS protection
- **User Sessions**: Persistent login state
- **Protected Routes**: Route-level authentication guards

## Project Structure

### Frontend Components

- `client/components/ui/voice-search.tsx`: Main voice search component
- `client/components/ui/voice-feedback.tsx`: Visual feedback for voice search
- `client/hooks/use-voice-search.ts`: Custom hook for voice search functionality
- `client/components/ImageSearch.tsx`: Main image search component
- `client/hooks/use-image-search.ts`: Custom hook for image search functionality

### Backend Components

- `server/controllers/imageSearchController.ts`: Image search processing
- `server/routes/imageSearchRoutes.ts`: Image search API routes
- `server/utils/importProducts.ts`: Product data import and processing

## Troubleshooting

### Voice Search Issues

If you encounter issues with voice search:

1. Make sure your browser supports the Web Speech API.
2. Check that you've granted microphone permissions to the website.
3. Try using Google Chrome, which has the best support for the Web Speech API.
4. Ensure you're in a quiet environment for better recognition accuracy.

### Image Search Issues

If you encounter issues with image search:

1. **File Upload Fails**: Check file size (max 5MB) and format (JPEG, PNG, GIF, WebP)
2. **Images Not Displaying**: Ensure the uploads directory exists and has proper permissions
3. **No Results**: Check MongoDB connection and product data import
4. **Server Errors**: Check server logs for detailed error messages

### General Issues

1. **MongoDB Connection Error**: Make sure MongoDB is running and the connection string is correct
2. **Port Conflicts**: Check if ports 5173 (frontend) and 8080 (backend) are available
3. **Dependencies**: Make sure all dependencies are installed with `npm install`
4. **Environment Variables**: Ensure your `.env` file is properly configured

## Development

### Adding New Features

1. **Frontend**: Add components in `client/components/`
2. **Backend**: Add controllers in `server/controllers/` and routes in `server/routes/`
3. **Database**: Add models in `server/models/`
4. **Styling**: Use Tailwind CSS classes and custom components

### Testing

```bash
# Run tests
npm test

# Type checking
npm run typecheck

# Format code
npm run format.fix
```

## Production Deployment

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

3. Set up environment variables for production
4. Configure MongoDB Atlas or local MongoDB
5. Set up proper CORS settings for your domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes and is not affiliated with Flipkart.
