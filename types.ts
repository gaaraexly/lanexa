
export interface Veo3Prompt {
  promptVideo: string;
  pembukaanKonsep: string;
  adegan: string;
  subjek: string;
  aksi: string;
  lingkungan: string;
  pencahayaan: string;
  suasanaHati: string;
  kalimatYangDiucapkan: string;
  promptNegatif: string;
  saranTambahan: {
    sudutKamera: string;
    pergerakanKamera: string;
    transisi: string;
    musikLatar: string;
    efekVisual: string;
  };
}

export interface DetailedEngPrompt {
    subjek: string;
    aksi: string;
    ekspresi: string;
    tempat: string;
    waktu: string;
    gerakanKamera: string;
    pencahayaan: string;
    gayaVideo: string;
    suasanaVideo: string;
    suaraAtauMusik: string;
    kalimatYangDiucapkan: string;
    detailTambahan: string;
}
