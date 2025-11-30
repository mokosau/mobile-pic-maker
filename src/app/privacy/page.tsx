import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// This function will run on the server side when the page is requested
async function getMarkdownContent(filename: string): Promise<string> {
  const filepath = path.join(process.cwd(), 'docs', filename);
  const content = fs.readFileSync(filepath, 'utf8');
  return marked(content);
}

export default async function PrivacyPage() {
  const htmlContent = await getMarkdownContent('privacy_policy.md');

  return (
    <div className="bg-white">
      <header className="shadow-md py-4 px-6 sm:px-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Privacy Policy
        </h1>
      </header>
      <main className="prose lg:prose-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </main>
    </div>
  );
}
