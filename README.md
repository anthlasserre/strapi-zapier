# Strapi Zapier Integration

A comprehensive Zapier integration for Strapi that allows you to connect any Strapi project to Zapier and automate CRUD operations on any content types.

## Features

- **Universal Content Type Support**: Works with any Strapi content type automatically
- **CRUD Operations**: Create, read, update, and delete entries
- **Real-time Triggers**: Monitor for new and updated entries
- **Dynamic Content Type Selection**: Automatically fetches available content types from your Strapi instance
- **Smart Content Type Filtering**: Only shows user-defined API content types (excludes admin and plugin types)
- **Flexible Search**: Find entries with custom queries
- **Secure Authentication**: Uses Strapi API tokens for secure access

## Setup

### Prerequisites

1. A Strapi instance (v4+)
2. An API token with appropriate permissions
3. Node.js 18+ and npm

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd strapi-zapier
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Test the integration:
```bash
npm test
```

### Strapi Configuration

1. **Create an API Token**:
   - Go to your Strapi admin panel
   - Navigate to Settings > API Tokens
   - Create a new token with the following permissions:
     - `api::content-type.read`
     - `api::content-type.find`
     - `api::content-type.create`
     - `api::content-type.update`
     - `api::content-type.delete`
     - Access to `/api/content-type-builder/content-types` (for dynamic content type loading)

2. **Configure Content Types**:
   - Ensure your content types have the necessary fields (title, description, etc.)
   - Make sure the content types are published and accessible via the API
   - Only visible content types (not admin or plugin types) will appear in the Zapier integration

## Authentication

The integration uses Strapi's API token authentication. You'll need to provide:

- **Base URL**: Your Strapi instance URL (e.g., `https://your-strapi-app.com`)
- **API Token**: The token you created in the Strapi admin panel

## Available Actions

### Triggers

#### New Entry
- **Trigger**: Fires when a new entry is created in any content type
- **Inputs**:
  - Content Type: Select the content type to monitor
  - Limit: Maximum number of entries to return (default: 50)

#### Updated Entry
- **Trigger**: Fires when an entry is updated in any content type
- **Inputs**:
  - Content Type: Select the content type to monitor
  - Limit: Maximum number of entries to return (default: 50)

### Creates

#### Create Entry
- **Action**: Creates a new entry in any content type with dynamic field support
- **Inputs**:
  - Content Type: Select the content type to create in
  - Entry Fields (JSON): JSON object containing all the fields for this entry
  - Published: Whether to publish the entry immediately (default: true)
  - **Field Validation**: Automatically validates and converts field types based on the content type schema
  - **Schema-Based**: Uses the actual content type schema to validate fields

### Searches

#### Find Entry
- **Action**: Searches for entries in any content type
- **Inputs**:
  - Content Type: Select the content type to search in
  - Search Query: Text to search for in title or description (optional)
  - Limit: Maximum number of entries to return (default: 10)

### Resources

#### Content Types
- **Purpose**: Lists all available content types in your Strapi instance
- **Use**: Automatically populates dropdowns for content type selection
- **Filtering**: Only shows user-defined API content types (excludes admin and plugin types)

#### Content Type Fields
- **Purpose**: Lists all available fields for each content type
- **Use**: Helps you understand what fields are available for each content type
- **Format**: Shows field name, type, and whether it's required

#### Content Type Schema
- **Purpose**: Provides detailed schema information for each content type
- **Use**: Shows all field details including types, validation rules, and default values
- **Format**: Complete schema with field metadata for creating entries

## Usage Examples

### Example 1: Automatically Create a Slack Message When a New Blog Post is Published

1. Set up a Zap with "New Entry" trigger
2. Select your "Blog Post" content type
3. Connect to Slack "Send Channel Message" action
4. Map the blog post title and content to the Slack message

### Example 2: Create a Google Sheet Row When a New Contact is Added

1. Set up a Zap with "New Entry" trigger
2. Select your "Contact" content type
3. Connect to Google Sheets "Create Spreadsheet Row" action
4. Map the contact fields to the spreadsheet columns

### Example 3: Send an Email When an Order Status is Updated

1. Set up a Zap with "Updated Entry" trigger
2. Select your "Order" content type
3. Connect to Gmail "Send Email" action
4. Send notification emails when order status changes

### Example 4: Create a New Blog Post from a Form Submission

1. Set up a Zap with "New Form Submission" trigger (from your form service)
2. Connect to "Create Entry" action
3. Select your "Blog Post" content type
4. Use the "Content Type Schema" resource to see available fields
5. Create a JSON object with all the required fields:
   ```json
   {
     "title": "My New Blog Post",
     "content": "This is the blog post content",
     "author": "John Doe",
     "category": "technology"
   }
   ```
6. Automatically create published blog posts from form submissions

## Development

### Project Structure

```
src/
├── authentication.ts    # Authentication configuration
├── constants.ts         # Common constants and mappings
├── hydrators.ts         # Dynamic field hydrators
├── index.ts            # Main app configuration
├── middleware.ts       # Request/response middleware
├── utils.ts            # Utility functions for Strapi API
├── triggers/           # Trigger definitions
│   ├── newEntry.ts
│   └── updatedEntry.ts
├── creates/            # Create action definitions
│   └── createEntry.ts
└── searches/           # Search action definitions
    └── findEntry.ts
```

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Development Commands

```bash
# Clean build artifacts
npm run clean

# Build the project
npm run build

# Run tests
npm test
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Verify your API token is correct
   - Ensure the token has the necessary permissions
   - Check that your Strapi instance URL is correct

2. **Content Type Not Found**:
   - Make sure the content type exists in your Strapi instance
   - Verify the content type is published and accessible via the API
   - Check that your API token has read permissions for the content type

3. **Permission Denied**:
   - Ensure your API token has the required permissions for the operations you're trying to perform
   - Check Strapi's role and permissions configuration

### Debug Mode

To enable debug logging, set the `ZAPIER_DEBUG` environment variable:

```bash
export ZAPIER_DEBUG=1
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the Strapi documentation
3. Open an issue in this repository

## Changelog

### v1.0.0
- Initial release
- Support for all Strapi content types
- CRUD operations (Create, Read, Update, Delete)
- Real-time triggers for new and updated entries
- Dynamic content type selection
- Secure API token authentication 
