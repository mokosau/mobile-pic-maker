export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-6 px-6 sm:px-8 text-center text-sm text-gray-500">
      <div className="space-x-4">
        <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
          利用規約
        </a>
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
          プライバシーポリシー
        </a>
      </div>
      <p className="mt-4">&copy; {currentYear} Screenshot Generator. All Rights Reserved.</p>
    </footer>
  );
}
