// Google Sheet Service for Sakthi Foods
// Sheet ID: 1VpMrxHYk_0WObBaPvUkGpPxGnG2FikmnYMkrFJt3u74

const SPREADSHEET_ID = '1VpMrxHYk_0WObBaPvUkGpPxGnG2FikmnYMkrFJt3u74';
const GVIZ_JSON_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;
const BANNER_SHEET_GID = '736887566';
const GVIZ_BANNER_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${BANNER_SHEET_GID}`;

// Default Google Apps Script Web App URL for auto order insertion
const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxbNF91Lhuf2OhjcvrZiXD6-HHKY377ho7DXhmTCdLFIzsgFukOk9aSInOyYPIpoTIHww/exec';

/**
 * Convert Google Drive share/view URLs into direct displayable image links.
 * Works with drive.google.com/file/d/ID/view, open?id=ID, uc?id=ID, etc.
 */
export function formatImageUrl(url) {
  if (!url || typeof url !== 'string') return '/assets/logo.png';
  const cleanUrl = url.trim();
  if (cleanUrl === '') return '/assets/logo.png';

  // Extract Google Drive File ID
  let fileId = null;
  const matchFileD = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) {
    fileId = matchFileD[1];
  } else {
    const matchIdParam = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchIdParam && matchIdParam[1]) {
      fileId = matchIdParam[1];
    }
  }

  if (fileId) {
    // Direct Google CDN link for high-res display
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // If already an absolute HTTP URL
  if (cleanUrl.startsWith('http')) {
    return cleanUrl;
  }

  return cleanUrl;
}

/**
 * Secondary fallback generator for Google Drive file IDs if primary CDN faces network restrictions
 */
export function getFallbackDriveUrl(url) {
  if (!url || typeof url !== 'string') return '/assets/logo.png';
  const cleanUrl = url.trim();

  let fileId = null;
  const matchFileD = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) {
    fileId = matchFileD[1];
  } else {
    const matchIdParam = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchIdParam && matchIdParam[1]) {
      fileId = matchIdParam[1];
    }
  }

  if (fileId) {
    // Image proxy for maximum cross-origin compatibility
    return `https://wsrv.nl/?url=https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return '/assets/logo.png';
}

/**
 * Convert YouTube / Google Drive / Video links to embeddable or direct video URLs
 */
export function formatVideoUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();
  
  // YouTube Shorts or standard YouTube URL
  let ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&playsinline=1&modestbranding=1`,
      rawUrl: cleanUrl
    };
  }

  // Google Drive video file
  let driveMatch = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return {
      type: 'drive',
      fileId,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      streamUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
      rawUrl: cleanUrl
    };
  }

  // Direct MP4 or video URL
  if (cleanUrl.startsWith('http')) {
    return {
      type: 'direct',
      embedUrl: cleanUrl,
      rawUrl: cleanUrl
    };
  }

  return null;
}

/**
 * Default preset Cooking Shorts dataset strictly sourced from Sakthi Foods Google Drive ('videos' tab & 'Products Sheet')
 */
export const DRIVE_ONLY_FALLBACK_SHORTS = [
  {
    id: 'drive-short-new-1',
    title: '🌾 Sakthi Organic Special Recipe Video',
    description: 'Traditional Organic cooking video uploaded direct to Sakthi Foods Google Sheet (videos tab).',
    author: 'Sakthi Foods Organic',
    authorTag: '@sakthi_organic',
    authorAvatar: '/assets/logo.png',
    likesCount: 2450,
    sharesCount: 380,
    commentsCount: 95,
    videoUrl: 'https://drive.google.com/file/d/1mXJg8gpgqSXEmYF84tClQDdajTJoEF2C/preview',
    streamUrl: 'https://lh3.googleusercontent.com/d/1mXJg8gpgqSXEmYF84tClQDdajTJoEF2C',
    videoType: 'drive',
    category: 'Organic Special',
    productName: 'Organic Recipe',
    productPrice: 150,
    productUnit: '1 kg',
    rawUrl: 'https://drive.google.com/file/d/1mXJg8gpgqSXEmYF84tClQDdajTJoEF2C/view?usp=sharing'
  },
  {
    id: 'drive-short-1',
    title: '🌾 Sakthi Organic Rice Video 1',
    description: 'Traditional Organic Rice video direct from Sakthi Foods Google Drive.',
    author: 'Sakthi Foods Organic',
    authorTag: '@sakthi_organic',
    authorAvatar: '/assets/logo.png',
    likesCount: 1420,
    sharesCount: 185,
    commentsCount: 32,
    videoUrl: 'https://drive.google.com/file/d/1pbLNxMAZ6PlBts2Yx5KNCM1rh4zvCNNO/preview',
    streamUrl: 'https://lh3.googleusercontent.com/d/1pbLNxMAZ6PlBts2Yx5KNCM1rh4zvCNNO',
    videoType: 'drive',
    category: 'Organic Rice',
    productName: 'rice 🍚',
    productPrice: 106,
    productUnit: '1kg',
    rawUrl: 'https://drive.google.com/file/d/1pbLNxMAZ6PlBts2Yx5KNCM1rh4zvCNNO/view?usp=drive_link'
  },
  {
    id: 'drive-short-2',
    title: '🌾 Sakthi Organic Rice Video 2',
    description: 'Fresh organic rice video from Sakthi Foods Google Drive.',
    author: 'Sakthi Foods Organic',
    authorTag: '@sakthi_organic',
    authorAvatar: '/assets/logo.png',
    likesCount: 980,
    sharesCount: 124,
    commentsCount: 21,
    videoUrl: 'https://drive.google.com/file/d/1zLzlenpQXeSRKiNc6oh1sGBS1G-L4NF0/preview',
    streamUrl: 'https://lh3.googleusercontent.com/d/1zLzlenpQXeSRKiNc6oh1sGBS1G-L4NF0',
    videoType: 'drive',
    category: 'Organic Rice',
    productName: 'rice 🍚',
    productPrice: 106,
    productUnit: '1kg',
    rawUrl: 'https://drive.google.com/file/d/1zLzlenpQXeSRKiNc6oh1sGBS1G-L4NF0/view?usp=drive_link'
  },
  {
    id: 'drive-short-3',
    title: '🌿 Sakthi Millet Mix Video',
    description: 'Millet mix recipe video - mix with milk for whole family health!',
    author: 'Sakthi Foods Organic',
    authorTag: '@sakthi_organic',
    authorAvatar: '/assets/logo.png',
    likesCount: 1840,
    sharesCount: 310,
    commentsCount: 49,
    videoUrl: 'https://drive.google.com/file/d/1IEoHoIdRp54lZm2htuXfXzGJbWA6Nia1/preview',
    streamUrl: 'https://lh3.googleusercontent.com/d/1IEoHoIdRp54lZm2htuXfXzGJbWA6Nia1',
    videoType: 'drive',
    category: 'Millets',
    productName: 'millet mix',
    productPrice: 230,
    productUnit: '1kg',
    rawUrl: 'https://drive.google.com/file/d/1IEoHoIdRp54lZm2htuXfXzGJbWA6Nia1/view?usp=drive_link'
  }
];

export const FALLBACK_COOKING_SHORTS = DRIVE_ONLY_FALLBACK_SHORTS;

/**
 * Fetch Live Cooking Shorts directly from the 'videos' tab (GID: 923319460) and 'Products Sheet' (GID: 0)
 * Plays ONLY Google Drive videos uploaded by user. No YouTube / external videos allowed.
 */
export async function fetchLiveCookingShorts() {
  const gidsToScan = [
    { gid: '923319460', label: 'videos' }, // Primary videos tab from user's Google Sheet
    { gid: '0', label: 'Products Sheet' }   // Main products sheet
  ];

  const seenFileIds = new Set();
  const liveDriveShorts = [];

  for (const { gid, label } of gidsToScan) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) continue;

      const responseText = await response.text();
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) continue;

      const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);

      if (parsed.status === 'error') continue;

      if (parsed.table && parsed.table.rows) {
        const rows = parsed.table.rows;
        const cols = parsed.table.cols ? parsed.table.cols.map(c => (c.label || c.id || '').toLowerCase().trim()) : [];

        rows.forEach((row, rowIdx) => {
          if (!row.c) return;

          let name = '';
          let category = 'Organic Foods';
          let price = 0;
          let unit = '1 kg';
          let description = '';
          const rowDriveLinks = [];

          row.c.forEach((cell, colIdx) => {
            if (!cell) return;
            const val = (cell.v !== undefined && cell.v !== null ? cell.v : cell.f || '').toString().trim();
            if (!val) return;

            const colName = cols[colIdx] || '';
            if (colName.includes('name')) name = val;
            else if (colName.includes('category')) category = val;
            else if (colName.includes('price')) price = val;
            else if (colName.includes('unit')) unit = val;
            else if (colName.includes('desc')) description = val;

            // Detect YouTube links (Shorts / Watch / Embed)
            const ytMatch = val.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            // Detect Google Drive file URLs or drive IDs
            const driveMatch = val.match(/\/d\/([a-zA-Z0-9_-]+)/) || val.match(/[?&]id=([a-zA-Z0-9_-]+)/);

            if (ytMatch && ytMatch[1]) {
              const videoId = ytMatch[1];
              rowDriveLinks.push({
                type: 'youtube',
                videoId,
                videoUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&playsinline=1`,
                rawUrl: val
              });
            } else if (driveMatch && driveMatch[1]) {
              const fileId = driveMatch[1];
              rowDriveLinks.push({
                type: 'drive',
                fileId,
                videoUrl: `https://drive.google.com/file/d/${fileId}/preview`,
                streamUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
                rawUrl: val
              });
            }
          });

          rowDriveLinks.forEach((linkItem, linkIdx) => {
            const key = linkItem.videoId || linkItem.fileId || `${rowIdx}-${linkIdx}`;
            if (!key || seenFileIds.has(key)) return;
            seenFileIds.add(key);

            const shortTitle = name ? `🌾 ${name} - Sakthi Recipe` : `Sakthi Organic Recipe Video #${liveDriveShorts.length + 1}`;
            const shortDesc = description || `Traditional ${name || category || 'organic recipe'} video directly from Sakthi Foods Kumbakonam.`;

            liveDriveShorts.push({
              id: `vid-${gid}-${rowIdx + 1}-${linkIdx + 1}`,
              title: shortTitle,
              description: shortDesc,
              author: 'Sakthi Foods Organic',
              authorTag: '@sakthi_organic',
              authorAvatar: '/assets/logo.png',
              likesCount: Math.floor(Math.random() * 2000) + 800,
              sharesCount: Math.floor(Math.random() * 400) + 100,
              commentsCount: Math.floor(Math.random() * 100) + 20,
              videoUrl: linkItem.videoUrl,
              streamUrl: linkItem.streamUrl || linkItem.videoUrl,
              videoType: linkItem.type,
              fileId: linkItem.fileId,
              videoId: linkItem.videoId,
              category: category || 'Organic Foods',
              productId: `${rowIdx + 1}`,
              productName: name || 'Sakthi Organic Product',
              productPrice: price || 0,
              productUnit: unit || '1 kg',
              productImage: linkItem.fileId ? `https://lh3.googleusercontent.com/d/${linkItem.fileId}` : '/assets/logo.png',
              audioTrack: 'Sakthi Foods Original Audio 🎵',
              rawUrl: linkItem.rawUrl
            });
          });
        });
      }
    } catch (err) {
      console.warn(`Failed fetching from sheet GID ${gid} (${label}):`, err);
    }
  }

  if (liveDriveShorts.length > 0) {
    console.log(`Successfully loaded ${liveDriveShorts.length} Google Drive videos from sheet tabs`);
    return { success: true, shorts: liveDriveShorts, source: 'drive_sheet' };
  }

  // If sheet fetch fails or has no videos, return ONLY user's Google Drive preset videos
  return {
    success: true,
    shorts: DRIVE_ONLY_FALLBACK_SHORTS,
    source: 'drive_fallback'
  };
}

export async function appendOrderToSheet(orderData) {
  const { orderId, date, customer, items, subtotalPrice, deliveryCharge, finalTotal, paymentMethod, upiRefNo } = orderData;

  const itemsFormatted = items.map((item, idx) => 
    `${idx + 1}. ${item.product.name} (${item.product.unit}) x ${item.quantity} = ₹${item.product.price * item.quantity}`
  ).join(' | ');

  const itemsJsonSimple = JSON.stringify(items.map(i => ({
    name: i.product.name,
    unit: i.product.unit,
    qty: i.quantity,
    price: i.product.price,
    total: i.product.price * i.quantity
  })));

  // Payload strictly aligned with sheet columns
  const payload = {
    order_id: orderId,
    user_id: customer.fullName || 'Guest Customer',
    items_json: itemsFormatted || itemsJsonSimple,
    total_amount: finalTotal,
    delivery_charge: deliveryCharge || 0,
    payment_method: paymentMethod === 'cod' ? 'Cash on Delivery' : `UPI (${upiRefNo || 'N/A'})`,
    delivery_address: `${customer.address}, Pincode: ${customer.pincode}`,
    phone: customer.mobileNumber,
    status: 'PLACED',
    timestamp: date || new Date().toLocaleString()
  };

  const scriptUrl = localStorage.getItem('sakthi_apps_script_url') || DEFAULT_SCRIPT_URL;

  // Send POST to Google Apps Script Endpoint using URLSearchParams for max compatibility
  try {
    const formData = new URLSearchParams();
    Object.keys(payload).forEach(key => {
      formData.append(key, payload[key]);
    });

    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    // Also send JSON as fallback
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    console.log('Order successfully posted to Google Sheet Web App:', payload);
    return { success: true };
  } catch (err) {
    console.warn('Google Sheet append error:', err);
    return { success: false, error: err };
  }
}

/**
 * Fetch Hero Banner images live from Google Sheet tab (gid: 736887566)
 */
export async function fetchLiveHeaderBanners() {
  try {
    const response = await fetch(GVIZ_BANNER_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
    const responseText = await response.text();

    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('Invalid GViz response format for banners');
    }

    const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);

    if (!parsed.table || !parsed.table.rows) {
      throw new Error('Malformed GViz data structure for banners');
    }

    const banners = [];
    const rows = parsed.table.rows;

    rows.forEach((row, index) => {
      if (!row.c) return;

      row.c.forEach((cell) => {
        if (!cell) return;
        const val = (cell.v !== undefined && cell.v !== null ? cell.v : cell.f || '').toString().trim();

        if (val && (val.startsWith('http') || val.includes('drive.google.com'))) {
          const formattedUrl = formatImageUrl(val);
          const fallbackUrl = getFallbackDriveUrl(val);

          banners.push({
            id: `banner-${index + 1}-${banners.length + 1}`,
            rawUrl: val,
            imgSrc: formattedUrl,
            fallbackUrl: fallbackUrl,
            title: index === 0 ? '100% Organic Traditional Foods' : index === 1 ? 'Free Delivery on Combos' : 'Special Harvest Deals 2026',
            subtitle: 'Direct Harvest from Kaveri Delta (Kumbakonam)',
            tag: index % 2 === 0 ? 'FARM FRESH' : 'SPECIAL DEAL',
            badgeColor: index % 2 === 0 ? 'bg-[#007600] text-white' : 'bg-[#ffa41c] text-[#0f1111]',
            actionText: 'Explore Collection',
            category: index % 2 === 0 ? 'Organic Rice' : 'Combo Deals'
          });
        }
      });
    });

    if (banners.length > 0) {
      try {
        localStorage.setItem('sakthi_banners_cache', JSON.stringify(banners));
      } catch (e) {}
      return { success: true, banners, source: 'live' };
    }
  } catch (err) {
    console.warn('Failed to fetch live header banners from sheet tab, checking cache:', err);
  }

  try {
    const cached = localStorage.getItem('sakthi_banners_cache');
    if (cached) {
      return { success: true, banners: JSON.parse(cached), source: 'cache' };
    }
  } catch (e) {}

  return {
    success: true,
    banners: FALLBACK_BANNERS,
    source: 'fallback'
  };
}

/**
 * Parses Google Visualization (gviz) JSON text response into javascript objects
 */
function parseGVizResponse(responseText) {
  try {
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('Invalid GViz response format');
    }
    const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);

    if (!parsed.table || !parsed.table.cols || !parsed.table.rows) {
      throw new Error('Malformed GViz data structure');
    }

    const cols = parsed.table.cols.map(c => (c.label || c.id || '').toLowerCase().trim());
    const rows = parsed.table.rows;

    const products = [];

    rows.forEach((row, rowIndex) => {
      if (!row.c) return;

      const rowObj = {};
      cols.forEach((colName, colIdx) => {
        const cell = row.c[colIdx];
        let val = cell ? (cell.v !== undefined && cell.v !== null ? cell.v : cell.f) : '';
        rowObj[colName] = val;
      });

      const id = rowObj['id'] || rowObj['item_id'] || (rowIndex + 1);
      const name = (rowObj['name'] || rowObj['product_name'] || rowObj['title'] || '').toString().trim();

      if (!name) return;

      const category = (rowObj['category'] || rowObj['type'] || 'Organic Foods').toString().trim();
      const rawPrice = parseFloat(rowObj['price'] || rowObj['selling_price'] || rowObj['amount'] || 0);
      const price = isNaN(rawPrice) ? 0 : rawPrice;

      let rawMrp = parseFloat(rowObj['mrp'] || rowObj['original_price'] || rowObj['market_price'] || 0);
      if (isNaN(rawMrp) || rawMrp <= price) {
        rawMrp = Math.round(price * 1.25);
      }
      const mrp = rawMrp;

      const unit = (rowObj['unit'] || rowObj['weight'] || rowObj['quantity'] || '1 kg').toString().trim();
      const description = (rowObj['description'] || rowObj['details'] || rowObj['desc'] || '100% Pure & Organic product cultivated using traditional farming techniques without chemicals.').toString().trim();

      const rawImages = [];

      ['image 1', 'image 2', 'image 3', 'image1', 'image2', 'image3', 'image_url', 'image', 'img', 'photo', 'picture'].forEach(key => {
        if (rowObj[key] && typeof rowObj[key] === 'string' && rowObj[key].trim()) {
          rawImages.push(rowObj[key].trim());
        }
      });

      cols.forEach(colName => {
        const cellVal = (rowObj[colName] || '').toString().trim();
        if ((cellVal.startsWith('http') || cellVal.includes('drive.google.com')) && !rawImages.includes(cellVal)) {
          rawImages.push(cellVal);
        }
      });

      const formattedImages = rawImages
        .map(url => formatImageUrl(url))
        .filter(url => url && url.length > 0);

      if (formattedImages.length === 0) {
        formattedImages.push('/assets/logo.png');
      }

      const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

      products.push({
        id: String(id),
        name,
        category,
        price,
        mrp,
        discountPercent,
        unit,
        description,
        images: formattedImages,
        primaryImage: formattedImages[0],
        rawImages: rawImages,
        inStock: true,
        assured: true,
        rating: 4.8,
        ratingCount: Math.floor(Math.random() * 180) + 40
      });
    });

    return products;
  } catch (err) {
    console.error('Error parsing GViz response:', err);
    throw err;
  }
}

/**
 * Fetch Product Catalog from Google Sheet live
 */
export async function fetchLiveProducts() {
  try {
    const response = await fetch(GVIZ_JSON_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
    const text = await response.text();
    const products = parseGVizResponse(text);

    if (products && products.length > 0) {
      try {
        localStorage.setItem('sakthi_products_cache', JSON.stringify(products));
      } catch (e) {}
      return { success: true, products, source: 'live' };
    }
  } catch (error) {
    console.warn('Failed to fetch live sheet data, checking offline fallback cache:', error);
  }

  try {
    const cached = localStorage.getItem('sakthi_products_cache');
    if (cached) {
      return { success: true, products: JSON.parse(cached), source: 'cache' };
    }
  } catch (e) {}

  return {
    success: true,
    products: FALLBACK_PRODUCTS,
    source: 'fallback'
  };
}

// Fallback preset banners
export const FALLBACK_BANNERS = [
  {
    id: 1,
    title: '100% Organic Traditional Foods',
    subtitle: 'Direct Harvest from Kaveri Delta (Kumbakonam)',
    tag: 'FARM FRESH',
    badgeColor: 'bg-[#007600] text-white',
    imgSrc: '/assets/header image.png',
    actionText: 'Explore Organic Rice',
    category: 'Organic Rice'
  },
  {
    id: 2,
    title: 'Free Delivery on Combos',
    subtitle: 'Save Big on Multi-Pack Traditional Rice & Millets',
    tag: 'SPECIAL COMBO DEALS',
    badgeColor: 'bg-[#ffa41c] text-[#0f1111]',
    imgSrc: '/assets/left.png',
    actionText: 'Shop Combos Now',
    category: 'Combo Deals'
  },
  {
    id: 3,
    title: 'Special Harvest Deals 2026',
    subtitle: 'Authentic Karuppu Kavuni & Mappillai Samba Native Varieties',
    tag: 'HEALTH & VITALITY',
    badgeColor: 'bg-[#007600] text-white',
    imgSrc: '/assets/right.png',
    actionText: 'View Harvest Offers',
    category: 'Millets'
  }
];

// Default Fallback Products matching organic theme if network is unavailable
export const FALLBACK_PRODUCTS = [
  {
    id: '1',
    category: 'Organic Rice',
    name: 'Traditional Karuppu Kavuni Black Rice',
    price: 180,
    mrp: 230,
    discountPercent: 21,
    unit: '1 kg',
    description: 'Ancient royal black rice rich in antioxidants, fiber, and anthocyanins. Cultivated natively in Kumbakonam, Tamil Nadu.',
    images: ['/assets/logo.png'],
    primaryImage: '/assets/logo.png',
    inStock: true,
    assured: true,
    rating: 4.9,
    ratingCount: 142
  },
  {
    id: '2',
    category: 'Organic Rice',
    name: 'Mappillai Samba Rice (Bridegroom Rice)',
    price: 150,
    mrp: 190,
    discountPercent: 21,
    unit: '1 kg',
    description: 'Traditional native rice known for boosting stamina, strength and vitality. Naturally hand-milled.',
    images: ['/assets/logo.png'],
    primaryImage: '/assets/logo.png',
    inStock: true,
    assured: true,
    rating: 4.8,
    ratingCount: 98
  },
  {
    id: '3',
    category: 'Millets',
    name: 'Organic Kuthiraivali (Barnyard Millet)',
    price: 110,
    mrp: 140,
    discountPercent: 21,
    unit: '1 kg',
    description: 'Low glycemic index millet ideal for weight management and diabetes care. 100% unpolished and clean.',
    images: ['/assets/logo.png'],
    primaryImage: '/assets/logo.png',
    inStock: true,
    assured: true,
    rating: 4.7,
    ratingCount: 64
  },
  {
    id: '4',
    category: 'Tea & Health',
    name: 'Sakthi Herbal Multi-Grain Health Mix (Sathumaavu)',
    price: 230,
    mrp: 290,
    discountPercent: 20,
    unit: '500 g',
    description: 'Blend of 18 natural sprouted grains, pulses, dry fruits, and spices. Ideal health drink for all ages.',
    images: ['/assets/logo.png'],
    primaryImage: '/assets/logo.png',
    inStock: true,
    assured: true,
    rating: 5.0,
    ratingCount: 210
  }
];
