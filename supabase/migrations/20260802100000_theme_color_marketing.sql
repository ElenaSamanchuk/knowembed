-- Align bot accent color with marketing primary (#5089fd)
alter table public.bots alter column theme_color set default '#5089fd';

update public.bots
set theme_color = '#5089fd'
where lower(theme_color) in ('#1d4ed8', '#2563eb', '#1e40af', '#3b82f6');
