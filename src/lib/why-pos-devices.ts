export type PosDeviceCard = {
  name: string;
  image: string;
  category: string;
  tagline: string;
  features: string[];
  ideal: string;
  isNew: boolean;
};

export type DeviceGroup = { group: string; devices: PosDeviceCard[] };

export const deviceGroups: DeviceGroup[] = [
  {
    "group": "PAX Terminals",
    "devices": [
      {
        "name": "NOQ A920 Pro",
        "image": "/why-pos/noq-a920pro-DfOXi1sm.webp",
        "category": "PAX",
        "tagline": "Premium Smart Mobile Terminal",
        "features": [
          "6\" HD Touchscreen",
          "Android 10",
          "4G + WiFi + Bluetooth",
          "Fast Thermal Printer",
          "All-day Battery",
          "NFC"
        ],
        "ideal": "Retail, Restaurants, Delivery",
        "isNew": false
      },
      {
        "name": "NOQ A920",
        "image": "/why-pos/noq-a920-CKH7C9uO.webp",
        "category": "PAX",
        "tagline": "All-in-One Smart Terminal",
        "features": [
          "5\" HD Display",
          "Android OS",
          "Dual SIM + WiFi",
          "Integrated Printer",
          "GPS",
          "EMV + NFC"
        ],
        "ideal": "On-the-Go Merchants, F&B",
        "isNew": false
      },
      {
        "name": "NOQ A910",
        "image": "/why-pos/noq-a910-CdVa4rSN.webp",
        "category": "PAX",
        "tagline": "Compact Smart POS",
        "features": [
          "5\" Touchscreen",
          "Android",
          "4G",
          "Built-in Camera",
          "Thermal Printer",
          "Multi-App Support"
        ],
        "ideal": "Small Retail, Services",
        "isNew": false
      },
      {
        "name": "NOQ A50S",
        "image": "/why-pos/noq-a50s-Bunwo7IH.webp",
        "category": "PAX",
        "tagline": "Portable Payment Terminal",
        "features": [
          "Compact Design",
          "NFC + EMV",
          "Long Battery Life",
          "Fast Processing",
          "Lightweight",
          "PIN Entry"
        ],
        "ideal": "Pop-ups, Events, Field Sales",
        "isNew": false
      },
      {
        "name": "NOQ IM30",
        "image": "/why-pos/noq-im30-BsABPT_l.webp",
        "category": "PAX",
        "tagline": "Smart Unattended Terminal",
        "features": [
          "Ruggedised Design",
          "Android Smart",
          "Kiosk Integration",
          "Self-Service Ready",
          "Weatherproof",
          "PCI 5.x"
        ],
        "ideal": "Vending, Kiosks, Parking",
        "isNew": false
      },
      {
        "name": "NOQ A8700",
        "image": "/why-pos/noq-a8700-Df9RQNIH.webp",
        "category": "PAX",
        "tagline": "Traditional Countertop Terminal",
        "features": [
          "Reliable & Sturdy",
          "Fast Processing",
          "Colour Display",
          "NFC",
          "Ethernet + Dial",
          "Thermal Printer"
        ],
        "ideal": "Fixed Counters, High Volume",
        "isNew": false
      },
      {
        "name": "NOQ A960",
        "image": "/why-pos/noq-a960-DI_JkArG.webp",
        "category": "PAX",
        "tagline": "Premium Android SmartPOS",
        "features": [
          "Large Touchscreen",
          "Android OS",
          "Dual Camera",
          "4G + WiFi",
          "Fast Processor",
          "Multi-App Platform"
        ],
        "ideal": "Enterprise Retail, Chain Stores",
        "isNew": false
      }
    ]
  },
  {
    "group": "Topwise Smart POS",
    "devices": [
      {
        "name": "NOQ T6",
        "image": "/why-pos/noq-t6-C4IcxGZW.webp",
        "category": "Topwise",
        "tagline": "Flagship Smart Mobile POS",
        "features": [
          "6.5\" HD Full Screen",
          "Android 13",
          "Large Memory",
          "Large Battery",
          "Latest Standards",
          "Industrial Design"
        ],
        "ideal": "High-End Retail, Hospitality",
        "isNew": true
      },
      {
        "name": "NOQ T6M",
        "image": "/why-pos/noq-t6m-orxw8es6.webp",
        "category": "Topwise",
        "tagline": "Premium Mobile Smart POS",
        "features": [
          "6.5\" HD Full Screen",
          "Android 13",
          "Large Memory",
          "Large Battery",
          "Latest Compatibility",
          "Excellent Design"
        ],
        "ideal": "Retail, Restaurants, Mobile",
        "isNew": true
      },
      {
        "name": "NOQ T3",
        "image": "/why-pos/noq-t3-CIpq3vAP.webp",
        "category": "Topwise",
        "tagline": "High-Performance Smart POS",
        "features": [
          "Quad Core 1.5GHz",
          "Android 11",
          "95mm/s Printer",
          "Fast CPU",
          "HD Display",
          "NFC + EMV"
        ],
        "ideal": "Retail, Quick Service",
        "isNew": false
      },
      {
        "name": "NOQ T1 Plus",
        "image": "/why-pos/noq-t1plus-BDIZAWzQ.webp",
        "category": "Topwise",
        "tagline": "Full-Screen Smart Mobile POS",
        "features": [
          "5.5\" HD Full Screen",
          "Android 11",
          "Large Memory",
          "Large Battery",
          "Compact Size",
          "NFC"
        ],
        "ideal": "Delivery, Field Sales, Events",
        "isNew": false
      },
      {
        "name": "NOQ T1 Pro",
        "image": "/why-pos/noq-t1pro-yYZ27gxz.webp",
        "category": "Topwise",
        "tagline": "Smart Mobile POS",
        "features": [
          "5.0\" HD Full Screen",
          "Android 7.0",
          "Latest Standards",
          "Compact Design",
          "NFC + EMV",
          "Thermal Printer"
        ],
        "ideal": "Small Business, Mobile Sales",
        "isNew": false
      },
      {
        "name": "NOQ MP45P",
        "image": "/why-pos/noq-mp45p-DqwmvEpj.webp",
        "category": "Topwise",
        "tagline": "Pocket-Sized Portable POS",
        "features": [
          "Quad Core 1.5GHz",
          "Android",
          "Camera Scanner",
          "Mini Size",
          "Pocket Design",
          "Fast Processing"
        ],
        "ideal": "Mobile Sales, Delivery",
        "isNew": true
      },
      {
        "name": "NOQ MP35PS",
        "image": "/why-pos/noq-mp35ps-CNAM_HD6.webp",
        "category": "Topwise",
        "tagline": "Portable Mini POS",
        "features": [
          "Quad Core 1.5GHz",
          "Android",
          "Mini Pocket Size",
          "Camera Scanner",
          "Lightweight",
          "Fast Processing"
        ],
        "ideal": "Delivery, On-the-Go Sales",
        "isNew": false
      }
    ]
  },
  {
    "group": "Topwise Conventional & mPOS",
    "devices": [
      {
        "name": "NOQ M3PS",
        "image": "/why-pos/noq-m3ps-H0uIowiQ.webp",
        "category": "Topwise",
        "tagline": "Conventional Portable POS",
        "features": [
          "LVGL Graphics",
          "Camera Scanner",
          "4G + 5GHz WiFi",
          "Portable Design",
          "Reliable Payment",
          "Multi-Network"
        ],
        "ideal": "Restaurants, Delivery, Mobile",
        "isNew": false
      },
      {
        "name": "NOQ MP35S",
        "image": "/why-pos/noq-mp35s-Cnz20z_S.webp",
        "category": "Topwise",
        "tagline": "Enhanced Mini POS",
        "features": [
          "Quad Core 1.5GHz",
          "Android",
          "QR Camera",
          "Mini Pocket Size",
          "Fast Processing",
          "Lightweight"
        ],
        "ideal": "Small Business, Pop-ups",
        "isNew": false
      },
      {
        "name": "NOQ M3S",
        "image": "/why-pos/noq-m3s-DUnbYxjq.webp",
        "category": "Topwise",
        "tagline": "Conventional Enhanced Mini POS",
        "features": [
          "LVGL Graphics",
          "QR Camera",
          "4G + 5GHz WiFi",
          "Compact Design",
          "Reliable",
          "Multi-Network"
        ],
        "ideal": "Small Merchants, Events",
        "isNew": false
      },
      {
        "name": "NOQ M3 BT",
        "image": "/why-pos/noq-m3bt-Cw2jTegW.webp",
        "category": "Topwise",
        "tagline": "Enhanced mPOS",
        "features": [
          "LVGL Graphics",
          "Large Memory",
          "900 Transactions Battery",
          "Bluetooth Pairing",
          "iOS & Android",
          "Compact"
        ],
        "ideal": "Mobile Merchants, Freelancers",
        "isNew": false
      }
    ]
  },
  {
    "group": "Topwise ECR & Desktop",
    "devices": [
      {
        "name": "NOQ E800",
        "image": "/why-pos/noq-e800-B1tQ5LQm.webp",
        "category": "Topwise",
        "tagline": "Fashionable Flagship SmartECR",
        "features": [
          "Android PayDroid",
          "Cash Register + POS",
          "Dual Screen",
          "3rd Party App Support",
          "All Payment Methods",
          "Business Management"
        ],
        "ideal": "Retail Stores, Hospitality",
        "isNew": false
      },
      {
        "name": "NOQ E700",
        "image": "/why-pos/noq-e700-DzFmjGvp.webp",
        "category": "Topwise",
        "tagline": "Sleek All-in-One Terminal",
        "features": [
          "12.5\" HD IPS",
          "4G + 5G + WiFi",
          "Inbuilt Camera",
          "Auto Brightness",
          "Fast Thermal Printer",
          "Quad-core"
        ],
        "ideal": "Shops, Restaurants, Hotels",
        "isNew": false
      },
      {
        "name": "NOQ A15",
        "image": "/why-pos/noq-a15-Crq7oEKf.webp",
        "category": "Topwise",
        "tagline": "Foldable Desktop Terminal",
        "features": [
          "Foldable Design",
          "Sleek Appearance",
          "Peripheral Expansion",
          "Flexible Setup",
          "Easy to Use",
          "Multi-Purpose"
        ],
        "ideal": "Supermarkets, Restaurants, Retail",
        "isNew": false
      },
      {
        "name": "NOQ A16",
        "image": "/why-pos/noq-a16-Byen-1xq.webp",
        "category": "Topwise",
        "tagline": "Smart Desktop Terminal",
        "features": [
          "Foldable Design",
          "Sleek Appearance",
          "Hardware Expansion",
          "Flexible Setup",
          "Touchscreen",
          "Multi-Purpose"
        ],
        "ideal": "Retail, Supermarkets, Restaurants",
        "isNew": false
      }
    ]
  },
  {
    "group": "Topwise Self-Service Kiosks",
    "devices": [
      {
        "name": "NOQ SK210",
        "image": "/why-pos/noq-sk210-BmGxWB3f.webp",
        "category": "Topwise",
        "tagline": "Smart Mini Kiosk",
        "features": [
          "Android 13",
          "8-core 2.0GHz",
          "10.1\" Screen",
          "Barcode Scanner",
          "High-Speed Printer",
          "Lightest in Class"
        ],
        "ideal": "Self-Service, Unmanned Retail",
        "isNew": false
      },
      {
        "name": "NOQ SK300",
        "image": "/why-pos/noq-sk300-CSwwnUWU.webp",
        "category": "Topwise",
        "tagline": "Compact Self-Service Kiosk",
        "features": [
          "Touchscreen Display",
          "Wall Mountable",
          "Self-Service Mode",
          "Payment Integration",
          "Compact Design",
          "Easy Deployment"
        ],
        "ideal": "Quick Service, Self-Checkout",
        "isNew": false
      },
      {
        "name": "NOQ SK700",
        "image": "/why-pos/noq-sk700-BDtdfYWs.webp",
        "category": "Topwise",
        "tagline": "Flexible Kiosk Solution",
        "features": [
          "21.5\" IPS",
          "Self-Service Ready",
          "Pairs with IM30",
          "Easy to Mount",
          "Customer Facing",
          "Versatile Mounting"
        ],
        "ideal": "Self-Service Kiosks, Ordering",
        "isNew": false
      }
    ]
  },
  {
    "group": "Topwise Specialty Devices",
    "devices": [
      {
        "name": "NOQ T2N",
        "image": "/why-pos/noq-t2n-BM_Iq2Xc.webp",
        "category": "Topwise",
        "tagline": "Smart Mobile Business Device",
        "features": [
          "5.0\" HD Full Screen",
          "Android 11",
          "Large Memory",
          "Barcode Scanner",
          "Voice Broadcast",
          "Receipt Printer"
        ],
        "ideal": "Checkout, Ordering, Management",
        "isNew": false
      },
      {
        "name": "NOQ TP10",
        "image": "/why-pos/noq-tp10-Dp3Gd_zA.webp",
        "category": "Topwise",
        "tagline": "Smart Payment Pinpad",
        "features": [
          "2.8\" Display",
          "Signature Support",
          "QR Camera",
          "Ethernet + WiFi",
          "Magnetic + IC + NFC",
          "High Performance"
        ],
        "ideal": "Countertop, Integrated Systems",
        "isNew": false
      },
      {
        "name": "NOQ F1",
        "image": "/why-pos/noq-f1-CYHNitZO.webp",
        "category": "Topwise",
        "tagline": "Facial Recognition Payment",
        "features": [
          "3D Camera",
          "Android Smart",
          "Hands-Free Payment",
          "High Performance CPU",
          "Fast Recognition",
          "Secure Payment"
        ],
        "ideal": "High-Tech Retail, Smart Venues",
        "isNew": false
      },
      {
        "name": "NOQ PR800",
        "image": "/why-pos/noq-pr800-CCyIzI_Z.webp",
        "category": "Topwise",
        "tagline": "Mini Thermal Printer",
        "features": [
          "250mm/s Print Speed",
          "Auto Cutter",
          "80mm Paper Roll",
          "Dual-Material Design",
          "Easy to Clean",
          "Durable"
        ],
        "ideal": "Receipt Printing, Retail, F&B",
        "isNew": false
      },
      {
        "name": "NOQ G2",
        "image": "/why-pos/noq-g2-wuov3kbc.webp",
        "category": "Topwise",
        "tagline": "High-Speed Barcode Scanner",
        "features": [
          "100MP Global CMOS",
          "High-Speed Decoding",
          "Ultra Responsive",
          "Wired & Wireless",
          "1D & 2D Codes",
          "Ergonomic Design"
        ],
        "ideal": "Retail, Logistics, Warehousing",
        "isNew": false
      }
    ]
  }
];
