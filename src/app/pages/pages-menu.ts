import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Call',
    icon: 'fa fa-phone',
    link: '/pages/call',
    home: true,
  },
  {
    title: 'Buddy',
    icon: 'fa fa-users',
    link: '/pages/buddy',
    home: false,
  },
  {
    title: 'Chat',
    icon: 'fa fa-comment',
    link: '/pages/chat',
    home: false,
  },
  {
    title: 'Search',
    icon: 'fa fa-search',
    link: '/pages/search',
    home: false,
  },
  {
    title: 'Setting',
    icon: 'fa fa-cog',
    link: '/pages/setting',
    home: false,
  },
];
