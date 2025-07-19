
import { Veo3Prompt } from './types';

export const PROMPT_STRUCTURE: {
  [key in keyof Omit<Veo3Prompt, 'saranTambahan'>]: string
} & {
  saranTambahan: { [key in keyof Veo3Prompt['saranTambahan']]: string }
} = {
  promptVideo: "Prompt Video",
  pembukaanKonsep: "Pembukaan Konsep",
  adegan: "Adegan",
  subjek: "Subjek",
  aksi: "Aksi",
  lingkungan: "Lingkungan",
  pencahayaan: "Pencahayaan",
  suasanaHati: "Suasana Hati",
  kalimatYangDiucapkan: "Kalimat yang Diucapkan",
  promptNegatif: "Prompt Negatif",
  saranTambahan: {
    sudutKamera: "Sudut Kamera",
    pergerakanKamera: "Pergerakan Kamera",
    transisi: "Transisi",
    musikLatar: "Musik Latar",
    efekVisual: "Efek Visual",
  },
};

export const INITIAL_PROMPT: Veo3Prompt = {
    promptVideo: "",
    pembukaanKonsep: "",
    adegan: "",
    subjek: "",
    aksi: "",
    lingkungan: "",
    pencahayaan: "",
    suasanaHati: "",
    kalimatYangDiucapkan: "",
    promptNegatif: "",
    saranTambahan: {
        sudutKamera: "",
        pergerakanKamera: "",
        transisi: "",
        musikLatar: "",
        efekVisual: "",
    }
};
