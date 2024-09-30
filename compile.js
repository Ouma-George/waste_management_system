const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// Directory containing your EJS templates
const templatesDir = path.join(__dirname, '/public/views');

// Directory to output HTML files
const outputDir = path.join(__dirname, 'public');

// Function to render EJS files from a directory recursively
const renderEJSFiles = (dir) => {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) throw err;

        files.forEach(file => {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory()) {
                // If it's a directory, recurse into it
                renderEJSFiles(filePath);
            } else if (file.isFile() && file.name.endsWith('.ejs')) {
                // Provide default data or mock data as necessary
                const data = {}; // Add any default data needed here
                const html = ejs.render(fs.readFileSync(filePath, 'utf-8'), data, { filename: filePath });

                // Create output path maintaining directory structure
                const outputFilePath = path.join(outputDir, path.relative(templatesDir, filePath).replace('.ejs', '.html'));
                // Ensure the output directory exists
                fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
                fs.writeFileSync(outputFilePath, html);
            }
        });
    });
};

// Start rendering EJS files
renderEJSFiles(templatesDir);
