import Phaser from 'phaser';

export const COLORS = {
  background: 0x1a1a2e,
  panel: 0x222222,
  accent: '#ffd700',
  accentHover: '#ffffff',
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
  danger: '#ff0000',
  synergy: '#ff00ff',
  xp: '#00ccff',
  material: '#e040fb',
} as const;

export const FONTS = {
  family: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  title: { fontSize: '32px', fontStyle: 'bold' },
  heading: { fontSize: '24px', fontStyle: 'bold' },
  body: { fontSize: '16px' },
  small: { fontSize: '14px' },
} as const;

export const LAYOUT = {
  canvasWidth: 800,
  canvasHeight: 600,
  centerX: 400,
  centerY: 300,
  panelAlpha: 0.9,
  fadeDuration: 400,
} as const;

export function createButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  onClick: () => void,
  style: 'primary' | 'secondary' = 'primary'
): Phaser.GameObjects.Text {
  const isPrimary = style === 'primary';
  const btn = scene.add.text(x, y, text, {
    fontSize: isPrimary ? '24px' : '16px',
    fontStyle: isPrimary ? 'bold' : undefined,
    color: COLORS.accent,
    fontFamily: FONTS.family,
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });

  btn.on('pointerover', () => {
    btn.setColor(COLORS.accentHover);
    btn.setScale(1.05);
  });
  btn.on('pointerout', () => {
    btn.setColor(COLORS.accent);
    btn.setScale(1.0);
  });
  btn.on('pointerdown', () => onClick());

  return btn;
}
