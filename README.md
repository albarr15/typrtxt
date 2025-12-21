# typrtxt

A typing practice application that lets you improve your skills while reading classic literature. Practice typing with meaningful text from novels like *Frankenstein*, *Little Women*, and *A Tale of Two Cities*.

##  [Video Demonstration](#) |  [Try it Out](http://typrtxt.vercel.app)

## Features

Typr offers a different take on the usual typing websites by allowing users to read meaningful and comprehensive texts from several novels available in the public domain. Check out features such as:

- **Smart Book Discovery** - Search for specific books or filter by genre, author, book length, or reading ease
- **Real-time WPM and accuracy tracking** - Responsive interface highlights incorrectly typed characters along with net WPM, timer, and acccuracy as you type
- **On-screen Keyboard Display** - Displays a keyboard component to assist with touch typing
- **Chapter Selection** - Choose specific chapters you want to practice with
- **Dark Mode** - Eye-friendly typing experience
- **Customizable Test Length** - Set your preferred word count: 100, 250, 500, 1000, or 5000 characters

## Tech Stack

- **Frontend**: Vue 3 (Composition API), TypeScript, Tailwind CSS, DaisyUI
- **Backend**: Supabase (PostgreSQL database, storage)
- **Content Source**: Epub files from [Standard Ebooks](https://standardebooks.org)
- **Libraries**: Epub.js, Vue Router
  
## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account
- Environment variables for Supabase credentials

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/typrtxt.git
   cd typrtxt
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env
   ```
   Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

## Project Structure

```
typrtxt/
├── public/             # Static assets
├── scripts/            # helper scripts and utility functions
├── src/
│   ├── assets/         # Global css
│   ├── components/     # Vue components
│   ├── lib/            # Supabase client configuration
│   ├── router/         # Vue Router setup
│   ├── types/          # Type definitions
│   ├── views/          # Page views

```

## How It Works

Typrtxt parses epub files from public domain novels, extracting clean text content organized by chapters. Parsed metadata such as title, creator, cover image, etc. from each file is stored in Supabase. 

## Roadmap

The project is still a work in progress with these features planned:

- [ ] **User Accounts** - Personal profiles and authentication
- [ ] **Granular Progress Saving** - Word or paragraph-level progress tracking
- [ ] **User Statistics** - Typing speed, accuracy, and improvement over time
- [ ] **Expanded Library** - Greater selection of books and genres

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/yourFeatureName`)
3. Commit your changes (`git commit -m 'Added featureName'`)
4. Push to the branch (`git push origin feature/yourFeatureName`)
5. Open a Pull Request

## Acknowledgments

- Inspired by [monkeytype](https://monkeytype.com), [entertrained.app](https://entertrained.app), and [typelit.io](https://typelit.io)
- All epub files sourced from [Standard Ebooks](https://standardebooks.org), a volunteer-driven project producing high-quality public domain ebooks
- Classic literature texts are in the public domain

## License

[MIT License](LICENSE) - feel free to use this project for learning and development

---

Made with 🩶 by albarr15 for book lovers and typing enthusiasts alike
