export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 py-6 px-6 sm:px-8 text-center text-sm text-gray-400">
      <div className="space-x-6">
        <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-white">
          利用規約
        </a>
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white">
          プライバシーポリシー
        </a>
      </div>
      <p className="mt-4">&copy; {currentYear} Screenshot Generator. All Rights Reserved.</p>
    </footer>
  );
}
