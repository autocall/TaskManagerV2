// src/utils/fileIcons.ts

const icons = import.meta.glob('../assets/file-icons/*.svg', { eager: true });

const extensionToIcon: Record<string, string> = {};

for (const path in icons) {
  const match = path.match(/\/([\w-]+)\.svg$/);
  if (match) {
    const ext = match[1].toLowerCase(); // 'zip', 'pdf', ...
    const mod = icons[path] as { default: string };
    extensionToIcon[ext] = mod.default;
  }
}

// Получить иконку по расширению
export function getFileIcon(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return extensionToIcon[ext] || extensionToIcon['default'];
}
