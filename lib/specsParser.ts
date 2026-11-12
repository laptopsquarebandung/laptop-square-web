export interface ParsedSpecs {
  cpu: string;
  ram: string;
  storage: string;
  display: string;
  gpu: string;
  os: string;
  highlights: string[];
  category: 'GAMING' | 'OLED' | 'BUSINESS' | 'STUDENT' | 'GENERAL';
}

export function parseSpecs(raw: string | null | undefined, name = '', price = 0): ParsedSpecs {
  if (!raw) {
    return {
      cpu: '',
      ram: '',
      storage: '',
      display: '',
      gpu: '',
      os: '',
      highlights: [],
      category: 'GENERAL'
    };
  }

  const text = String(raw);
  const parts = text.split(/[/|]/).map(p => p.trim()).filter(Boolean);

  let cpu = '';
  let ram = '';
  let storage = '';
  let display = '';
  let gpu = '';
  let os = '';

  for (const part of parts) {
    const lower = part.toLowerCase();

    // 1. Processor (CPU)
    if (
      !cpu &&
      (lower.includes('intel') ||
        lower.includes('ryzen') ||
        lower.includes('amd') ||
        lower.includes('core') ||
        lower.includes('ultra') ||
        lower.includes('celeron') ||
        lower.includes('athlon') ||
        /^m[1-4]\b/i.test(part)) &&
      !lower.includes('graphics') &&
      !lower.includes('gpu')
    ) {
      cpu = part;
      continue;
    }

    // 2. RAM
    if (
      !ram &&
      (/(\d+\s*gb|\b2x\d+\s*gb)/i.test(part) &&
        (lower.includes('ddr') ||
          lower.includes('ram') ||
          lower.includes('lpddr') ||
          lower.includes('unified') ||
          (!lower.includes('ssd') && !lower.includes('nvme') && !lower.includes('tb') && !lower.includes('storage'))))
    ) {
      ram = part;
      continue;
    }

    // 3. Storage
    if (
      !storage &&
      (lower.includes('ssd') ||
        lower.includes('nvme') ||
        lower.includes('emmc') ||
        lower.includes('pcie') ||
        (lower.includes('tb') && !lower.includes('ddr')) ||
        (/\b(256|512|1024)\s*gb\b/i.test(part) && ram && !lower.includes('ram')))
    ) {
      storage = part;
      continue;
    }

    // 4. Display
    if (
      !display &&
      (lower.includes('"') ||
        lower.includes('inch') ||
        lower.includes('oled') ||
        lower.includes('fhd') ||
        lower.includes('qhd') ||
        lower.includes('wuxga') ||
        lower.includes('ips') ||
        lower.includes('2.8k') ||
        lower.includes('4k'))
    ) {
      display = part;
      continue;
    }

    // 5. GPU
    if (
      !gpu &&
      (lower.includes('rtx') ||
        lower.includes('gtx') ||
        lower.includes('geforce') ||
        lower.includes('radeon') ||
        lower.includes('arc') ||
        lower.includes('graphics') ||
        lower.includes('5060') ||
        lower.includes('4060') ||
        lower.includes('4050') ||
        lower.includes('3050') ||
        lower.includes('2050'))
    ) {
      gpu = part;
      continue;
    }

    // 6. OS / Software
    if (
      !os &&
      (lower.includes('win') ||
        lower.includes('windows') ||
        lower.includes('ohs') ||
        lower.includes('office') ||
        lower.includes('macos') ||
        lower.includes('dos') ||
        lower.includes('m365'))
    ) {
      os = part;
      continue;
    }
  }

  // Determine Category Tag
  const allText = `${name} ${raw}`.toLowerCase();
  let category: 'GAMING' | 'OLED' | 'BUSINESS' | 'STUDENT' | 'GENERAL' = 'GENERAL';

  if (
    allText.includes('rtx') ||
    allText.includes('gtx') ||
    allText.includes('gaming') ||
    allText.includes('loq') ||
    allText.includes('tuf') ||
    allText.includes('nitro') ||
    allText.includes('katana') ||
    allText.includes('cyborg') ||
    allText.includes('victus') ||
    allText.includes('omen') ||
    allText.includes('pongo')
  ) {
    category = 'GAMING';
  } else if (allText.includes('oled')) {
    category = 'OLED';
  } else if (
    allText.includes('yoga') ||
    allText.includes('zenbook') ||
    allText.includes('macbook') ||
    allText.includes('spectre') ||
    allText.includes('swift') ||
    price >= 16000000
  ) {
    category = 'BUSINESS';
  } else if (price > 0 && price <= 8500000) {
    category = 'STUDENT';
  }

  const highlights = [cpu, ram, storage, display, gpu].filter(Boolean);

  return {
    cpu,
    ram,
    storage,
    display,
    gpu,
    os,
    highlights,
    category
  };
}
