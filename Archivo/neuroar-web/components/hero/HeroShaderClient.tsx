'use client';
import dynamic from 'next/dynamic';

const HeroShader = dynamic(() => import('./HeroShader').then((m) => m.HeroShader), { ssr: false });

export default HeroShader;
