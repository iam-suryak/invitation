// Dynamic & Editable Wedding Invitation Configuration
export const weddingConfig = {
  groomName: "Divakar",
  groomFullName: "Divakar Palanisamy",
  groomParents: "Son of Mr. Palanisamy & Mrs. Latha Palanisamy",
  
  brideName: "Keerthana",
  brideFullName: "Keerthana Pannerselvam",
  brideParents: "Daughter of Mr. Pannerselvam & Mrs. Menaga Pannerselavam",

  weddingDate: "2026-11-01T06:30:00+05:30", // Primary Wedding Date: 1st Nov 2026
  displayDate: "Sunday, 1st November 2026",
  displayTime: "6:00 AM Muhurtham Onwards",
  
  tagline: "Together with their beloved families, invite you to celebrate their union of love and togetherness",
  
  venueName: "Sri karungaliyamman Kovil Mandapam",
  venueAddress: "Sri karungaliyamman Kovil Mandapam, Kathalapettai,Elampiallai, Salem, TamilNadu",
  googleMapsUrl: "https://maps.app.goo.gl/U1CQwk5dfNNvKKAy9",

  theme: "royal-maroon",

  // Tamil Marriage Music Configuration
  // Put your favorite Tamil song MP3 file inside assets/music/wedding.mp3
  musicUrl: "./assets/music/wedding.mp3",
  musicTracks: [
    {
      id: "custom",
      name: "🎵 Your Custom Tamil Marriage Song",
      url: "./assets/music/wedding.mp3"
    },
    {
      id: "nadaswaram",
      name: "🎺 Traditional Tamil Wedding Instrumental",
      url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113220.mp3"
    }
  ],

  
    // {
    //   // id: "haldi",
    //   // title: "Haldi & Mehendi",
    //   // subTitle: "Splashes of Turmeric & Vibrant Henna",
    //   // date: "Friday, 30th Oct 2026",
    //   // time: "10:00 AM Onwards",
    //   // venue: "Courtyard Lawn",
    //   // dressCode: "Sunshine Yellow / Ethnic Green",
    //   // icon: "sun",
    //   // description: "Join us as we smear the bride and groom with turmeric and paint hands with traditional henna designs!"
    // },
    events: 
  [
    {
      id: "reception",
      title: "Grand Reception",
      subTitle: "Dinner, Music & Celebration",
      date: "Saturday, 31st Oct 2026",
      time: "7:00 PM Onwards",
      venue: "Sri karungaliyamman Kovil Mandapam",
      dressCode: "Royal Formal / Designer Evening Wear",
      icon: "sparkles",
      description: "Celebrate the joyous wedding eve with a grand banquet feast, live musical performances, and blessings."
    },
    {
      id: "wedding",
      title: "Subh Vivah (The Marriage)",
      subTitle: "Sacred Muhurtham & Eternal Promises",
      date: "Sunday, 1st Nov 2026",
      time: "6:00 AM - 7:30 AM (Muhurtham)",
      venue: "Sri karungaliyamman Kovil Mandapam",
      dressCode: "Traditional Silk Saree & Dhoti / Sherwani",
      icon: "heart",
      description: "Witness the sacred rituals and auspicious Muhurtham as Divakar and Keerthana unite forever as husband and wife."
    }
  ],

  story: [
    {
      year: "2026",
      title: "First Encounter",
      desc: "Met and spent hours talking about life, dreams, and family."
    },
    {
      year: "2026",
      title: "The Proposal",
      desc: "Under the sunset, surrounded by glowing fairy lights, Divakar asked Keerthana to be his forever."
    },
    {
      year: "2026",
      title: "Forever Begins",
      desc: "Now embarking on a lifelong adventure surrounded by loved ones."
    }
  ],

  contactInfo: {
    rsvpHotline: "+91 7010183994",
    email: "divakar.keerthana.wedding@gmail.com"
  }
};
