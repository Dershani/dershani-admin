import { ICommand, commands } from '@uiw/react-md-editor';
import {
  Bold,
  Code,
  Code2,
  Edit3,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  // HelpCircle,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListChecks,
  ListOrdered,
  LucideProps,
  Maximize,
  MessageSquare,
  Minus,
  Play,
  Quote,
  Strikethrough,
  Table as TableIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// helper to wrap commands with custom render
const withRender = (
  command: ICommand,
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >,
  tooltip: string
): ICommand => ({
  ...command,
  icon: <Icon className="size-3" />,
  render: (cmd, disabled, executeCommand) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={disabled}
            onClick={() => executeCommand(cmd)}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  },
});

export const getCommands: () => ICommand[] = () => [
  withRender(commands.bold, Bold, 'Kalın (Ctrl + B)'),
  withRender(commands.italic, Italic, 'İtalik (Ctrl + I)'),
  withRender(
    commands.strikethrough,
    Strikethrough,
    'Üstü çizili (Ctrl + Shift + X)'
  ),
  withRender(commands.hr, Minus, 'Yatay çizgi (Ctrl + H)'),
  commands.group(
    [
      withRender(commands.heading1, Heading1, 'Başlık 1 (Ctrl + 1)'),
      withRender(commands.heading2, Heading2, 'Başlık 2 (Ctrl + 2)'),
      withRender(commands.heading3, Heading3, 'Başlık 3 (Ctrl + 3)'),
      withRender(commands.heading4, Heading4, 'Başlık 4 (Ctrl + 4)'),
      withRender(commands.heading5, Heading5, 'Başlık 5 (Ctrl + 5)'),
      withRender(commands.heading6, Heading6, 'Başlık 6 (Ctrl + 6)'),
    ],
    {
      name: 'title',
      groupName: 'title',
      buttonProps: { 'aria-label': 'Başlık ekle', title: 'Başlık ekle' },
    }
  ),
  commands.divider,
  withRender(commands.link, LinkIcon, 'Bağlantı ekle (Ctrl + L)'),
  withRender(commands.quote, Quote, 'Alıntı ekle'),
  withRender(commands.code, Code, 'Kod ekle (Ctrl + J)'),
  withRender(commands.codeBlock, Code2, 'Kod bloğu ekle (Ctrl + Shift + J)'),
  withRender(commands.comment, MessageSquare, 'Yorum ekle (Ctrl + /)'),
  withRender(commands.image, ImageIcon, 'Resim ekle (Ctrl + K)'),
  withRender(commands.table, TableIcon, 'Tablo ekle'),
  commands.divider,
  withRender(
    commands.unorderedListCommand,
    List,
    'Sırasız liste (Ctrl + Shift + U)'
  ),
  withRender(
    commands.orderedListCommand,
    ListOrdered,
    'Sıralı liste (Ctrl + Shift + O)'
  ),
  withRender(
    commands.checkedListCommand,
    ListChecks,
    'Kontrol listesi (Ctrl + Shift + C)'
  ),
  // commands.divider,
  // withRender(commands.help, HelpCircle, 'Yardım'),
];

export const getExtraCommands: () => ICommand[] = () => [
  withRender(commands.codeEdit, Edit3, 'Kodu düzenle (Ctrl + 7)'),
  withRender(commands.codeLive, Play, 'Canlı kod (Ctrl + 8)'),
  withRender(commands.codePreview, Eye, 'Önizleme (Ctrl + 9)'),
  commands.divider,
  withRender(commands.fullscreen, Maximize, 'Tam ekran (Ctrl + 0)'),
];
