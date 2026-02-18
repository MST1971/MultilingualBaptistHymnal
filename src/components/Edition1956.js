import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Edition.css';

function Edition1956({ theme }) {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const hymnsPerPage = 50;
  
  // Load saved data on initial render
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('hymnFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Load last viewed page from localStorage
    const savedPage = localStorage.getItem('hymn1956Page');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);
  
  // Save current page to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('hymn1956Page', currentPage.toString());
  }, [currentPage]);

  // Function to go back to the previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  // Function to toggle history visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  // Function to toggle favorite status
  const toggleFavorite = (e, hymnId) => {
    e.preventDefault(); // Prevent navigation to hymn detail
    e.stopPropagation(); // Prevent event bubbling
    
    const newFavorites = favorites.includes(hymnId)
      ? favorites.filter(id => id !== hymnId)
      : [...favorites, hymnId];
    
    setFavorites(newFavorites);
    localStorage.setItem('hymnFavorites', JSON.stringify(newFavorites));
  };

  // Function to handle pagination
  const goToPage = (page) => {
    setCurrentPage(page);
    // Scroll to top of list
    document.querySelector('.hymn-list-section').scrollTop = 0;
  };

  // Hymn data for the 1956 Baptist Hymnal
  const allHymns = [
    { id: 1, title: "Holy, holy, holy, Lord God Almighty!", tune: "NICAEA" },
    { id: 2, title: "Love divine, all loves excelling", tune: "LOVE DIVINE" },
    { id: 3, title: "All creatures of our God and King", tune: "LASST UNS ERFREUEN" },
    { id: 4, title: "Mighty God, while angels bless Thee", tune: "AUTUMN" },
    { id: 5, title: "God, our Father, we adore Thee!", tune: "LOVE DIVINE" },
    { id: 6, title: "Praise to the Lord, the Almighty, the King of creation!", tune: "LOBE DEN HERRN" },
    { id: 7, title: "Let all on earth their voices raise", tune: "ARIEL" },
    { id: 8, title: "All things bright and beautiful", tune: "SPOHR" },
    { id: 9, title: "Praise the Lord! ye heavens, adore Him", tune: "HYFRYDOL" },
    { id: 10, title: "The spacious firmament on high", tune: "CREATION" },
    { id: 11, title: "We praise thee, O God, our Redeemer, Creator", tune: "KREMSER" },
    { id: 12, title: "Come, Thou Almighty King", tune: "ITALIAN HYMN (TRINITY)" },
    { id: 13, title: "All people that on earth do dwell", tune: "OLD 100TH" },
    { id: 14, title: "Praise to God, immortal praise", tune: "DIX" },
    { id: 15, title: "Sun of my soul, Thou Saviour dear", tune: "HURSLEY" },
    { id: 16, title: "Stand up, and bless the Lord", tune: "OLD 134TH (ST. MICHAEL)" },
    { id: 17, title: "Rejoice, ye pure in heart", tune: "MARION" },
    { id: 18, title: "Praise, my soul, the King of heaven", tune: "REGENT SQUARE" },
    { id: 19, title: "Now to the Lord a noble song", tune: "DUKE STREET" },
    { id: 20, title: "O worship the King, all glorious above", tune: "LYONS" },
    { id: 21, title: "Welcome, Delightful Morn", tune: "LISCHER" },
    { id: 22, title: "Christ, Whose Glory Fills the Skies", tune: "RATISBON" },
    { id: 23, title: "When Morning Gilds the Skies", tune: "LAUDES DOMINI" },
    { id: 24, title: "Awake, My Tongue, Thy Tribute Bring", tune: "DUKE STREET" },
    { id: 25, title: "Still, Still with Thee", tune: "CONSOLATION" },
    { id: 26, title: "Awake, My Soul, in Joyful Lays", tune: "LOVING KINDNESS" },
    { id: 27, title: "Saviour, Again to Thy Dear Name We Raise", tune: "ELLERS" },
    { id: 28, title: "Now, on Land and Sea Descending", tune: "VESPER HYMN" },
    { id: 29, title: "Day Is Dying in the West", tune: "CHAUTAUQUA" },
    { id: 30, title: "God That Madest Earth and Heaven", tune: "AR HYD Y NOS" },
    { id: 31, title: "Lord, Dismiss Us with Thy Blessing", tune: "SICILIAN MARINERS" },
    { id: 32, title: "The Radiant Morn Hath Passed Away", tune: "ST. GABRIEL" },
    { id: 33, title: "Softly Now the Light of Day", tune: "SEYMOUR" },
    { id: 34, title: "Saviour, Breathe an Evening Blessing", tune: "EVENING PRAYER" },
    { id: 35, title: "Now the Day is Over", tune: "MERRIAL" },
    { id: 36, title: "O Day of Rest and Gladness", tune: "MENDEBRAS" },
    { id: 37, title: "Safely Through Another Week", tune: "SABBATH" },
    { id: 38, title: "With Joy We Hail the Sacred Day", tune: "ST. ANNE" },
    { id: 39, title: "This Is the Day the Lord Hath Made", tune: "ARLINGTON" },
    { id: 40, title: "A Mighty Fortress Is Our God", tune: "EIN' FESTE BURG" },
    { id: 41, title: "To God Be the Glory", tune: "TO GOD BE THE GLORY" },
    { id: 42, title: "God the Almighty One", tune: "RUSSIAN HYMN" },
    { id: 43, title: "Immortal, Invisible, God Only Wise", tune: "ST. DENIO" },
    { id: 44, title: "Joyful, Joyful, We Adore Thee", tune: "HYMN TO JOY" },
    { id: 45, title: "God, Who Touchest Earth with Beauty", tune: "GENEVA" },
    { id: 46, title: "Father, I Stretch My Hands to Thee", tune: "MANOAH" },
    { id: 47, title: "Great Is Thy Faithfulness", tune: "FAITHFULNESS" },
    { id: 48, title: "There's a Wideness in God's Mercy", tune: "WELLESLEY" },
    { id: 49, title: "Begin, My Tongue, Some Heavenly Theme", tune: "MANOAH" },
    { id: 50, title: "God Is Love", tune: "STUTTGART" },
    { id: 51, title: "O My Soul, Bless God the Father", tune: "STUTTGART" },
    { id: 52, title: "O Love of God Most Full", tune: "TRENTHAM" },
    { id: 53, title: "God Moves in a Mysterious Way", tune: "ST. ANNE" },
    { id: 54, title: "God of Our Fathers", tune: "NATIONAL HYMN" },
    { id: 55, title: "Guide Me, O Thou Great Jehovah", tune: "CWM RHONDDA" },
    { id: 56, title: "Guide Me, O Thou Great Jehovah", tune: "ZION" },
    { id: 57, title: "The Lord Is My Shepherd", tune: "POLAND" },
    { id: 58, title: "He Leadeth Me", tune: "HE LEADETH ME" },
    { id: 59, title: "This Is My Father's World", tune: "TERRA PATRIS" },
    { id: 60, title: "Lead, Kindly Light", tune: "SANDON" },
    { id: 61, title: "Eternal Father, strong to save", tune: "MELITA" },
    { id: 62, title: "Be thou my vision, O Lord of my heart", tune: "SLANE" },
    { id: 63, title: "The first Noel the angel did say", tune: "THE FIRST NOEL" },
    { id: 64, title: "Angels we have heard on high", tune: "GLORIA" },
    { id: 65, title: "Joy to the world! the Lord is come", tune: "ANTIOCH" },
    { id: 66, title: "O come, all ye faithful, joyful and triumphant", tune: "ADESTE FIDELES" },
    { id: 67, title: "Brightest and best of the sons of the morning", tune: "MORNING STAR" },
    { id: 68, title: "As with gladness men of old", tune: "DIX" },
    { id: 69, title: "There's a song in the air!", tune: "CHRISTMAS SONG" },
    { id: 70, title: "Hail, thou long expected Jesus", tune: "HARWELL" },
    { id: 71, title: "It came upon the midnight clear", tune: "CAROL" },
    { id: 72, title: "Silent night, holy night", tune: "STILLE NACHT" },
    { id: 73, title: "Gentle Mary laid her Child", tune: "TEMPUS ADEST FLORIDUM" },
    { id: 74, title: "Good Christian men, rejoice", tune: "IN DULCI JUBILO" },
    { id: 75, title: "O little town of Bethlehem", tune: "ST. LOUIS" },
    { id: 76, title: "Angels, from the realms of glory", tune: "REGENT SQUARE" },
    { id: 77, title: "Away in a manger, no crib for a bed", tune: "MUELLER" },
    { id: 78, title: "I heard the bells on Christmas day", tune: "WALTHAM" },
    { id: 79, title: "While shepherds watched their flocks by night", tune: "CHRISTMAS" },
    { id: 80, title: "Let all mortal flesh keep silence", tune: "PICARDY" },
    { id: 81, title: "Hark, the herald angels sing", tune: "MENDELSSOHN" },
    { id: 82, title: "Thou didst leave Thy throne", tune: "MARGARET" },
    { id: 83, title: "My dear Redeemer and my Lord", tune: "FEDERAL STREET" },
    { id: 84, title: "How beauteous were the marks divine", tune: "CANONBURY" },
    { id: 85, title: "One day when heaven was filled with His praises", tune: "CHAPMAN" },
    { id: 86, title: "The great Physician now is near", tune: "GREAT PHYSICIAN" },
    { id: 87, title: "The Lily of the Valley", tune: "SALVATIONIST" },
    { id: 88, title: "The Light of the World is Jesus", tune: "LIGHT OF THE WORLD" },
    { id: 89, title: "We would see Jesus; lo! His star is shining", tune: "CUSHMAN" },
    { id: 90, title: "Into the woods my Master went", tune: "LANIER" },
    { id: 91, title: "O sacred Head, now wounded", tune: "PASSION CHORALE" },
    { id: 92, title: "There is a fountain filled with blood", tune: "CLEANSING FOUNTAIN" },
    { id: 93, title: "The Old Rugged Cross", tune: "OLD RUGGED CROSS" },
    { id: 94, title: "At the Cross", tune: "HUDSON" },
    { id: 95, title: "Down at the cross where my Saviour died", tune: "GLORY TO HIS NAME" },
    { id: 96, title: "At Calvary", tune: "CALVARY" },
    { id: 97, title: "Jesus, Keep Me Near the Cross", tune: "NEAR THE CROSS" },
    { id: 98, title: "There Is a Green Hill Far Away", tune: "GREEN HILL" },
    { id: 99, title: "When I Survey the Wondrous Cross", tune: "HAMBURG" },
    { id: 100, title: "In the Cross of Christ I Glory", tune: "RATHBUN" },
    { id: 101, title: "Alas, and did my Saviour bleed", tune: "AVON" },
    { id: 102, title: "Ride on! ride on in majesty", tune: "TRURO" },
    { id: 103, title: "Rock of Ages, cleft for me", tune: "TOPLADY" },
    { id: 104, title: "'Tis midnight, and on Olive's brow", tune: "OLIVE'S BROW" },
    { id: 105, title: "Go to dark Gethsemane", tune: "GETHSEMANE" },
    { id: 106, title: "Up Calvary's mountain one dreadful morn", tune: "REDEEMER" },
    { id: 107, title: "The strife is o'er, the battle done", tune: "VICTORY" },
    { id: 108, title: "Rejoice, the Lord is King", tune: "DARWALL" },
    { id: 109, title: "Come, ye faithful, raise the strain", tune: "ST. KEVIN" },
    { id: 110, title: "Welcome, happy morning", tune: "HERMAS" },
    { id: 111, title: "The day of resurrection!", tune: "GREENLAND" },
    { id: 112, title: "Our Lord Christ hath risen! the tempter is foiled", tune: "KIRN" },
    { id: 113, title: "Low in the grave He lay", tune: "CHRIST AROSE" },
    { id: 114, title: "Hallelujah! hallelujah!", tune: "McGRANAHAN" },
    { id: 115, title: "Christ the Lord is risen today", tune: "EASTER HYMN" },
    { id: 116, title: "Jesus shall reign where'er the sun", tune: "DUKE STREET" },
    { id: 117, title: "The head that once was crowned with thorns", tune: "AZMON" },
    { id: 118, title: "Majestic sweetness sits enthroned", tune: "ORTONVILLE" },
    { id: 119, title: "Will Jesus Find Us Watching", tune: "WOODSTOCK" },
    { id: 120, title: "It may be at morn, when the day is awaking", tune: "CHRIST RETURNETH" },
    { id: 121, title: "He is coming, the 'Man of Sorrows,'", tune: "NEWCASTLE" },
    { id: 122, title: "Rise, my soul, and stretch thy wings", tune: "AMSTERDAM" },
    { id: 123, title: "Lo, He comes with clouds descending", tune: "REGENT SQUARE" },
    { id: 124, title: "There's a light upon the mountains", tune: "AUTUMN" },
    { id: 125, title: "What If It Were Today", tune: "SECOND COMING" },
    { id: 126, title: "The Lord will come and not be slow", tune: "ST. MAGNUS" },
    { id: 127, title: "I know that my Redeemer liveth", tune: "HANNAH" },
    { id: 128, title: "Come, let us tune our loftiest song", tune: "DUKE STREET" },
    { id: 129, title: "O for a thousand tongues to sing", tune: "AZMON" },
    { id: 130, title: "What a Wonderful Saviour", tune: "BENTON HARBOR" },
    { id: 131, title: "There is a name I love to hear", tune: "OH, HOW I LOVE JESUS" },
    { id: 132, title: "All hail the power of Jesus' name!", tune: "CORONATION" },
    { id: 133, title: "All hail the power of Jesus' name!", tune: "MILES LANE" },
    { id: 134, title: "All hail the power of Jesus' name!", tune: "DIADEM" },
    { id: 135, title: "Jesus, the very thought of Thee", tune: "ST. AGNES" },
    { id: 136, title: "Jesus, Thou joy of loving hearts", tune: "QUEBEC" },
    { id: 137, title: "Praise him! praise him! Jesus, our blessed Redeemer!", tune: "JOYFUL SONG" },
    { id: 138, title: "Glorious Is Thy Name", tune: "GLORIOUS NAME" },
    { id: 139, title: "I stand amazed in the presence", tune: "MY SAVIOUR'S LOVE" },
    { id: 140, title: "Blessed Be the Name", tune: "BLESSED NAME" },
    { id: 141, title: "I love to tell the story", tune: "HANKEY" },
    { id: 142, title: "There is never a day so dreary", tune: "NEW ORLEANS" },
    { id: 143, title: "I will sing of my Redeemer", tune: "MY REDEEMER" },
    { id: 144, title: "I will sing the wondrous story", tune: "WONDROUS STORY" },
    { id: 145, title: "Hark, ten thousand harps and voices", tune: "HARWELL" },
    { id: 146, title: "O could I speak the matchless worth", tune: "ARIEL" },
    { id: 147, title: "Ye servants of God, your Master proclaim", tune: "LYONS" },
    { id: 148, title: "Look, ye saints! the sight is glorious", tune: "REGENT SQUARE" },
    { id: 149, title: "Hail, Thou once despised Jesus!", tune: "AUTUMN" },
    { id: 150, title: "I love Thee, I love Thee, I love Thee, my Lord", tune: "I LOVE THEE" },
    { id: 151, title: "All glory, laud, and honor", tune: "ST. THEODULPH" },
    { id: 152, title: "Crown Him with many crowns", tune: "DIADEMATA" },
    { id: 153, title: "For the beauty of the earth", tune: "DIX" },
    { id: 154, title: "Great Redeemer, we adore Thee", tune: "REDENTORE" },
    { id: 155, title: "Jesus is all the world to me", tune: "ELIZABETH" },
    { id: 156, title: "Jesus, lover of my soul", tune: "MARTYN" },
    { id: 157, title: "Jesus, lover of my soul", tune: "REFUGE" },
    { id: 158, title: "Jesus, Lover of my soul", tune: "ABERYSTWYTH" },
    { id: 159, title: "Fairest Lord Jesus", tune: "CRUSADERS' HYMN" },
    { id: 160, title: "How sweet the name of Jesus sounds", tune: "ORTONVILLE" },
    { id: 161, title: "Ask ye what great thing I know", tune: "HENDON" },
    { id: 162, title: "Shepherd of tender youth", tune: "KIRBY BEDON" },
    { id: 163, title: "'Man of sorrows,' what a name", tune: "HALLELUJAH! WHAT A SAVIOUR" },
    { id: 164, title: "O Thou God of my salvation", tune: "REGENT SQUARE" },
    { id: 165, title: "Holy Spirit, faithful guide", tune: "FAITHFUL GUIDE" },
    { id: 166, title: "Spirit of God, descend upon my heart", tune: "LONGWOOD" },
    { id: 167, title: "Breathe on me, Breath of God", tune: "TRENTHAM" },
    { id: 168, title: "The Holy Ghost is here", tune: "BOYLSTON" },
    { id: 169, title: "Come, Holy Spirit, heav'nly Dove", tune: "BALERMA" },
    { id: 170, title: "Holy Ghost, with light divine", tune: "MERCY" },
    { id: 171, title: "Holy Spirit, from on high", tune: "SEYMOUR" },
    { id: 172, title: "Spirit divine, attend our pray'r", tune: "BRECON" },
    { id: 173, title: "Lord, Pentecost Power", tune: "OLD-TIME POWER" },
    { id: 174, title: "Breathe on me", tune: "TRUETT" },
    { id: 175, title: "Seal us, O Holy Spirit", tune: "CARSON" },
    { id: 176, title: "Word of God, across the ages", tune: "AUSTRIAN HYMN" },
    { id: 177, title: "Revealing Word, thy light portrays", tune: "ST. PETERSBURG" },
    { id: 178, title: "Break Thou the bread of life", tune: "BREAD OF LIFE" },
    { id: 179, title: "Holy Bible, Book divine", tune: "ALETTA" },
    { id: 180, title: "Thy Word is a lamp to my feet", tune: "EOLA" },
    { id: 181, title: "Wonder Word of Life", tune: "WORDS OF LIFE" },
    { id: 182, title: "Thy Word is like a garden, Lord", tune: "CLONMEL" },
    { id: 183, title: "O Word of God Incarnate", tune: "MUNICH" },
    { id: 184, title: "I know the Bible was sent from God", tune: "GRICE" },
    { id: 185, title: "The Divine Gift", tune: "ANCIENT OF DAYS" },
    { id: 186, title: "A glory gilds the sacred page", tune: "BURLINGTON" },
    { id: 187, title: "The heavens Declare thy glory", tune: "DUKE STREET" },
    { id: 188, title: "Amazing grace! how sweet the sound", tune: "AMAZING GRACE" },
    { id: 189, title: "Thou, O Christ of Calvary", tune: "MOORE" },
    { id: 190, title: "I saw the cross of Jesus", tune: "WHITFIELD" },
    { id: 191, title: "We have heard the joyful sound", tune: "JESUS SAVES" },
    { id: 192, title: "Are You Washed in the Blood?", tune: "WASHED IN THE BLOOD" },
    { id: 193, title: "There Is Power in the Blood", tune: "POWER IN THE BLOOD" },
    { id: 194, title: "He Included Me", tune: "SEWELL" },
    { id: 195, title: "Christ Receiveth Sinful Men", tune: "NEUMEISTER" },
    { id: 196, title: "The Way of the Cross Leads Home", tune: "WAY OF THE CROSS" },
    { id: 197, title: "Saved, Saved!", tune: "RAPTURE" },
    { id: 198, title: "He Is Able to Deliver Thee", tune: "DELIVERANCE" },
    { id: 199, title: "Free from the law, O happy condition", tune: "ONCE FOR ALL" },
    { id: 200, title: "Grace Greater than Our Sin", tune: "MOODY" },
    { id: 201, title: "Whiter than Snow", tune: "FISCHER" },
    { id: 202, title: "In loving-kindness Jesus came", tune: "HE LIFTED ME" },
    { id: 203, title: "Redeemed, how I love to proclaim it!", tune: "REDEEMED" },
    { id: 204, title: "Nothing but the Blood", tune: "PLAINFIELD" },
    { id: 205, title: "We praise Thee, O God! for the Son of Thy love", tune: "REVIVE US AGAIN" },
    { id: 206, title: "No, not despairingly", tune: "KEDRON" },
    { id: 207, title: "Rescue the perishing, Care for the dying", tune: "RESCUE" },
    { id: 208, title: "Since I have Been Redeemed", tune: "OTHELLO" },
    { id: 209, title: "I am happy today and the sun shines bright", tune: "McCONNELL" },
    { id: 210, title: "I lay my sins on Jesus", tune: "AURELIA" },
    { id: 211, title: "Tell me the story of Jesus", tune: "STORY OF JESUS" },
    { id: 212, title: "Love Lifted Me", tune: "SAFETY" },
    { id: 213, title: "Tho' your sins be as scarlet", tune: "CRIMSON" },
    { id: 214, title: "When the sun shines bright and your heart is light", tune: "LURA" },
    { id: 215, title: "A ruler once came to Jesus by night", tune: "BORN AGAIN" },
    { id: 216, title: "I am resolved no longer to linger", tune: "RESOLUTION" },
    { id: 217, title: "Throw out the life line across the dark wave", tune: "LIFELINE" },
    { id: 218, title: "While we pray and while we plead", tune: "WHY NOT NOW?" },
    { id: 219, title: "Pass me not, O gentle Saviour", tune: "PASS ME NOT" },
    { id: 220, title: "Why do you wait, dear brother", tune: "SHEFFIELD" },
    { id: 221, title: "I need Thee, precious Jesus", tune: "AURELIA" },
    { id: 222, title: "Tell me the old, old story", tune: "OLD, OLD STORY" },
    { id: 223, title: "God calling yet! shall I not hear?", tune: "WOODWORTH" },
    { id: 224, title: "I hear Thy welcome voice", tune: "WELCOME VOICE" },
    { id: 225, title: "Jesus Paid It All", tune: "ALL TO CHRIST" },
    { id: 226, title: "Come to the Saviour now", tune: "INVITATION" },
    { id: 227, title: "Come unto me, ye weary", tune: "MEIRIONYDD" },
    { id: 228, title: "My soul in sad exile was out on life's sea", tune: "HAVEN OF REST" },
    { id: 229, title: "Jesus is tenderly calling thee home", tune: "CALLING TODAY" },
    { id: 230, title: "Let Jesus Come into Your Heart", tune: "McCONNELSVILLE" },
    { id: 231, title: "The Nail-scarred Hand", tune: "LUBBOCK" },
    { id: 232, title: "I am Praying for You", tune: "INTERCESSION" },
    { id: 233, title: "Out of my bondage, sorrow and night", tune: "JESUS, I COME" },
    { id: 234, title: "O Why Not Tonight", tune: "CALVIN" },
    { id: 235, title: "Only Trust Him", tune: "STOCKTON" },
    { id: 236, title: "Softly and tenderly Jesus is calling", tune: "THOMPSON" },
    { id: 237, title: "Lord, I'm Coming Home", tune: "COMING HOME" },
    { id: 238, title: "Whosoever Will", tune: "WHOSOEVER" },
    { id: 239, title: "His Way with Thee", tune: "NUSBAUM" },
    { id: 240, title: "Just as I am, without one plea", tune: "WOODWORTH" },
    { id: 241, title: "Come ye sinners, poor and needy", tune: "ARISE" },
    { id: 242, title: "Depth of mercy! can there be", tune: "SEYMOUR" },
    { id: 243, title: "I am coming to the cross", tune: "TRUSTING" },
    { id: 244, title: "Come, says Jesus' sacred voice", tune: "HORTON" },
    { id: 245, title: "Art thou weary, heavy laden", tune: "STEPHANOS" },
    { id: 246, title: "Come to Jesus, ye who labor", tune: "BULLINGER" },
    { id: 247, title: "Lift up your heads, ye mighty gates", tune: "TRURO" },
    { id: 248, title: "Almost persuaded, now to believe", tune: "ALMOST PERSUADED" },
    { id: 249, title: "Just as I am, Thine own to be", tune: "JUST AS I AM" },
    { id: 250, title: "Blow, ye the trumpet, blow!", tune: "LENOX" },
    { id: 251, title: "My Jesus, as Thou wilt!", tune: "JEWETT" },
    { id: 252, title: "Faith of our fathers! living still", tune: "ST. CATHERINE" },
    { id: 253, title: "Have faith in God when your pathway is lonely", tune: "MUSKOGEE" },
    { id: 254, title: "Cast thy burden on the Lord", tune: "SEYMOUR" },
    { id: 255, title: "O for a faith that will not shrink", tune: "ARLINGTON" },
    { id: 256, title: "Faith is the Victory", tune: "SANKEY" },
    { id: 257, title: "My faith looks up to Thee", tune: "OLIVET" },
    { id: 258, title: "'Tis so sweet to trust in Jesus", tune: "TRUST IN JESUS" },
    { id: 259, title: "Trusting every day", tune: "TRUSTING JESUS" },
    { id: 260, title: "When we walk with the Lord", tune: "TRUST AND OBEY" },
    { id: 261, title: "I've found a friend, oh, such a friend!", tune: "FRIEND" },
    { id: 262, title: "How firm a foundation, ye saints of the Lord", tune: "ADESTE FIDELES" },
    { id: 263, title: "How firm a foundation, ye saints of the Lord", tune: "FOUNDATION" },
    { id: 264, title: "There shall be showers of blessing", tune: "SHOWERS OF BLESSING" },
    { id: 265, title: "It is well with My Soul", tune: "VILLE DE HAVRE" },
    { id: 266, title: "Standing on the promises of Christ my King", tune: "PROMISES" },
    { id: 267, title: "Just when I need Him, Jesus is near", tune: "GABRIEL" },
    { id: 268, title: "All the way my Saviour leads me", tune: "ALL THE WAY" },
    { id: 269, title: "Blessed assurance, Jesus is mine!", tune: "ASSURANCE" },
    { id: 270, title: "A Child of the King", tune: "BINGHAMTON" },
    { id: 271, title: "O safe to the Rock that is higher than I", tune: "HIDING IN THEE" },
    { id: 272, title: "He Hideth My Soul", tune: "KIRKPATRICK" },
    { id: 273, title: "Sunshine in my soul", tune: "SUNSHINE" },
    { id: 274, title: "God Will Take Care of You", tune: "GOD CARES" },
    { id: 275, title: "I know Whom I have Believed", tune: "EL NATHAN" },
    { id: 276, title: "I know not how that Bethlehem's Babe", tune: "ST. AGNES" },
    { id: 277, title: "Immortal Love, forever full", tune: "SERENITY" },
    { id: 278, title: "I will not forget thee", tune: "SWEET PROMISE" },
    { id: 279, title: "He Lives", tune: "ACKLEY" },
    { id: 280, title: "The King of love my Shepherd is", tune: "DOMINUS REGIT ME" },
    { id: 281, title: "Nearer, still nearer, close to Thy heart", tune: "MORRIS" },
    { id: 282, title: "Hope of the world, Thou Christ of great compassion", tune: "O PERFECT LOVE" },
    { id: 283, title: "The Solid Rock", tune: "SOLID ROCK" },
    { id: 284, title: "We'll Work Till Jesus Comes", tune: "LAND OF REST" },
    { id: 285, title: "Wonderful Peace of My Saviour", tune: "VENTING" },
    { id: 286, title: "O God, our help in ages past", tune: "ST. ANNE" },
    { id: 287, title: "O Holy Saviour, friend unseen", tune: "FLEMMING" },
    { id: 288, title: "Jesus, Thy boundless love to me", tune: "ST. CATHERINE" },
    { id: 289, title: "My Jesus, I love Thee, I know Thou art mine", tune: "GORDON" },
    { id: 290, title: "O Love that wilt not let me go", tune: "ST. MARGARET" },
    { id: 291, title: "Saviour, teach me day by day", tune: "INNOCENTS" },
    { id: 292, title: "More love to Thee, O Christ", tune: "MORE LOVE TO THEE" },
    { id: 293, title: "Love Is the Theme", tune: "FISHER" },
    { id: 294, title: "Like a river glorious", tune: "WYE VALLEY" },
    { id: 295, title: "Abide with me: fast falls the eventide", tune: "EVENTIDE" },
    { id: 296, title: "From every stormy wind that blows", tune: "RETREAT" },
    { id: 297, title: "Come, ye disconsolate, where'er ye languish", tune: "CONSOLATION (WEBBE)" },
    { id: 298, title: "I must tell Jesus all of my trials", tune: "ORWIGSBURG" },
    { id: 299, title: "Sweet Peace, the Gift of God's Love", tune: "SWEET PEACE" },
    { id: 300, title: "Let the Lower Lights Be Burning", tune: "LOWER LIGHTS" },
    { id: 301, title: "Near to the Heart of God", tune: "McAFEE" },
    { id: 302, title: "I heard the voice of Jesus say", tune: "SPOHR" },
    { id: 303, title: "In heavenly love abiding", tune: "NYLAND" },
    { id: 304, title: "He is so Precious to me", tune: "PRECIOUS TO ME" },
    { id: 305, title: "Take the name of Jesus with you", tune: "PRECIOUS NAME" },
    { id: 306, title: "How tedious and tasteless the hours", tune: "CONTRAST" },
    { id: 307, title: "He Keeps Me Singing", tune: "SWEETEST NAME" },
    { id: 308, title: "We are Marching to Zion", tune: "MARCHING TO ZION" },
    { id: 309, title: "Awake, my soul, stretch every nerve", tune: "CHRISTMAS" },
    { id: 310, title: "Since Jesus Came into My Heart", tune: "McDANIEL" },
    { id: 311, title: "There's a glad new song ringing in my heart", tune: "REDEEMING LOVE" },
    { id: 312, title: "Open my eyes that I may see", tune: "SCOTT" },
    { id: 313, title: "Come, Thou Fount of every blessing", tune: "NETTLETON" },
    { id: 314, title: "Draw Thou my soul, O Christ", tune: "ST. EDMUND" },
    { id: 315, title: "I would be true, for there are those who trust me", tune: "PEEK" },
    { id: 316, title: "More like Jesus would I be", tune: "MORE LIKE JESUS" },
    { id: 317, title: "In the hour of trial", tune: "PENITENCE" },
    { id: 318, title: "Count Your Blessings", tune: "BLESSINGS" },
    { id: 319, title: "Higher Ground", tune: "HIGHER GROUND" },
    { id: 320, title: "The Rock that is Higher than I", tune: "ROCK OF REFUGE" },
    { id: 321, title: "More about Jesus would I know", tune: "SWENEY" },
    { id: 322, title: "Nearer, my God, to Thee", tune: "BETHANY" },
    { id: 323, title: "So let our lips and lives express", tune: "WAREHAM" },
    { id: 324, title: "We would see Jesus, for the shadows lengthen", tune: "CONSOLATION" },
    { id: 325, title: "More like the Master I would ever be", tune: "HANFORD" },
    { id: 326, title: "Saviour, more, than life to me, I am clinging", tune: "EVERY DAY AND HOUR" },
    { id: 327, title: "Sweet hour of prayer, sweet hour of prayer", tune: "SWEET HOUR" },
    { id: 328, title: "What a friend we have in Jesus", tune: "CONVERSE" },
    { id: 329, title: "'Tis the blessed hour of prayer", tune: "BLESSED HOUR" },
    { id: 330, title: "Teach me to pray, Lord, teach me to pray", tune: "REITZ" },
    { id: 331, title: "Speak to my heart, Lord Jesus", tune: "HOLCOMB" },
    { id: 332, title: "Lord, lay some soul upon my heart", tune: "LEILA" },
    { id: 333, title: "Lord, Send a revival, O Christ, my Lord", tune: "MATTHEWS" },
    { id: 334, title: "I need Thee every hour", tune: "NEED" },
    { id: 335, title: "Dear Lord and Father of mankind", tune: "REST (ELTON)" },
    { id: 336, title: "Prayer is the soul's sincere desire", tune: "CAMPMEETING" },
    { id: 337, title: "Jesus, Saviour, pilot me", tune: "PILOT" },
    { id: 338, title: "More holiness give me", tune: "MY PRAYER" },
    { id: 339, title: "Lord, for tomorrow and its needs", tune: "VINCENT" },
    { id: 340, title: "Lord, speak to me, that I may speak", tune: "CANONBURY" },
    { id: 341, title: "Child Morning Hymn", tune: "WE THANK THEE" },
    { id: 342, title: "Send a Great Revival", tune: "TRAVIS AVENUE" },
    { id: 343, title: "Our Father in heaven, we hallow Thy name", tune: "ST. MICHEL'S" },
    { id: 344, title: "Saviour, like a shepherd lead us", tune: "BRADBURY" },
    { id: 345, title: "Beneath the cross of Jesus", tune: "ST. CHRISTOPHER" },
    { id: 346, title: "O Jesus, Thou art standing", tune: "ST. HILDA" },
    { id: 347, title: "Wherever He Leads I'll Go", tune: "FALLS CREEK" },
    { id: 348, title: "Let Others See Jesus in You", tune: "COLEMAN" },
    { id: 349, title: "I am Thine, O Lord, I have heard Thy voice", tune: "I AM THINE" },
    { id: 350, title: "Is Your All on the Altar", tune: "HOFFMAN" },
    { id: 351, title: "\"Are ye able,\" said the Master", tune: "BEACON HILL" },
    { id: 352, title: "Living for Jesus a life that is true", tune: "LIVING" },
    { id: 353, title: "Give of your best to the Master", tune: "BARNARD" },
    { id: 354, title: "Thou, my everlasting portion", tune: "CLOSE TO THEE" },
    { id: 355, title: "Have Thine own way, Lord!", tune: "POLLARD" },
    { id: 356, title: "Take my life, and let it be", tune: "YARBROUGH" },
    { id: 357, title: "Take my life and let it be", tune: "HENDON" },
    { id: 358, title: "A charge to keep I have", tune: "BOYLSTON" },
    { id: 359, title: "I'll Live for Him", tune: "DUNBAR" },
    { id: 360, title: "Jesus calls us o'er the tumult", tune: "GALILEE" },
    { id: 361, title: "Where He Leads Me", tune: "NORRIS" },
    { id: 362, title: "Footstep of Jesus", tune: "FOOTSTEPS" },
    { id: 363, title: "I surrender All", tune: "SURRENDER" },
    { id: 364, title: "Yield not to temptation", tune: "PALMER" },
    { id: 365, title: "Oh, for a closer walk with God", tune: "BALERMA" },
    { id: 366, title: "Blest be the tie that binds", tune: "DENNIS" },
    { id: 367, title: "Take time to be holy", tune: "HOLINESS" },
    { id: 368, title: "Brethren, we have met to worship", tune: "HOLY MANNA" },
    { id: 369, title: "Purer in heart, O God", tune: "PURER IN HEART" },
    { id: 370, title: "Walk in the light! so shalt thou know", tune: "MANOAH" },
    { id: 371, title: "Leaning on the Everlasting Arms", tune: "SHOWALTER" },
    { id: 372, title: "God be with you till we meet again!", tune: "GOD BE WITH YOU" },
    { id: 373, title: "O happy home where Thou art loved the dearest", tune: "ALVERSTROKE" },
    { id: 374, title: "Happy the home when God is there", tune: "ST. AGNES" },
    { id: 375, title: "O Thou whose gracious presence blest", tune: "REST (ELTON)" },
    { id: 376, title: "Friend of the home, as when, in Galilee", tune: "ELLERS" },
    { id: 377, title: "God, give us Christian homes!", tune: "CHRISTIAN HOME" },
    { id: 378, title: "Zion stands with hills surrounded", tune: "ZION" },
    { id: 379, title: "O Thou whose hand has brought us", tune: "WEBB" },
    { id: 380, title: "The church's one foundation", tune: "AURELIA" },
    { id: 381, title: "Glorious things of thee are spoken", tune: "AUSTRIAN HYMN" },
    { id: 382, title: "I love Thy kingdom, Lord", tune: "ST. THOMAS" },
    { id: 383, title: "O where are the kings and empires now", tune: "ST. ANNE" },
    { id: 384, title: "This rite our blest Redeemer gave", tune: "McCOMB" },
    { id: 385, title: "Come, Holy Spirit, Dove divine", tune: "MARYTON" },
    { id: 386, title: "O Jesus, I have promised", tune: "ANGEL'S STORY" },
    { id: 387, title: "Jesus, I my cross have taken", tune: "ELLESDIE" },
    { id: 388, title: "O Thou who in Jordan", tune: "ST. MICHEL'S" },
    { id: 389, title: "O happy day that fixed my choice", tune: "HAPPY DAY" },
    { id: 390, title: "Thou hast said, exalted Jesus", tune: "GREENVILLE" },
    { id: 391, title: "Here, O my Lord, I see Thee face to face", tune: "PENITENTIA" },
    { id: 392, title: "Here at Thy table, Lord", tune: "BREAD OF LIFE" },
    { id: 393, title: "In memory of the Saviour's love", tune: "ST. PETER" },
    { id: 394, title: "Bread of the world, in mercy broken", tune: "EUCHARISTIC HYMN" },
    { id: 395, title: "Bread of heav'n, on Thee we feed", tune: "HOLLEY" },
    { id: 396, title: "Be present at our table, Lord", tune: "UXBRIDGE" },
    { id: 397, title: "A parting hymn we sing", tune: "LABAN" },
    { id: 398, title: "Be known to us in breaking bread", tune: "DUNDEE" },
    { id: 399, title: "I gave my life for thee", tune: "KENOSIS" },
    { id: 400, title: "Something for Thee", tune: "SOMETHING FOR JESUS" },
    { id: 401, title: "Master, no offering, Costly and Sweet", tune: "LOVE'S OFFERING" },
    { id: 402, title: "We give Thee but Thine own", tune: "ST. ANDREW" },
    { id: 403, title: "All things are Thine; no gift have we", tune: "GERMANY" },
    { id: 404, title: "Trust, Try and Prove Me", tune: "GIVING" },
    { id: 405, title: "Am I a soldier of the cross", tune: "ARLINGTON" },
    { id: 406, title: "Fight the good fight with all thy might!", tune: "PENTECOST" },
    { id: 407, title: "Loyalty to Christ", tune: "LAMBDIN" },
    { id: 408, title: "The Banner of the Cross", tune: "ROYAL BANNER" },
    { id: 409, title: "The Kingdom Is Coming", tune: "THE KINGDOM IS COMING" },
    { id: 410, title: "Truehearted, wholehearted, faithful and loyal", tune: "TRUEHEARTED" },
    { id: 411, title: "Dare to be brave, dare to be true", tune: "COURAGE" },
    { id: 412, title: "Onward, Christian soldiers", tune: "ST. GERTRUDE" },
    { id: 413, title: "Who is on the Lord's side?", tune: "ARMAGEDDON" },
    { id: 414, title: "The Son of God goes forth to war", tune: "ALL SAINTS, NEW" },
    { id: 415, title: "Stand up, stand up for Jesus", tune: "WEBB" },
    { id: 416, title: "Soldiers of Christ, arise", tune: "DIADEMATA" },
    { id: 417, title: "Lead on, O King Eternal", tune: "LANCASHIRE" },
    { id: 418, title: "Once to every man and nation", tune: "AUSTRIAN HYMN" },
    { id: 419, title: "Stand up, stand up for Jesus", tune: "GEIBEL" },
    { id: 420, title: "My soul, be on thy guard", tune: "LABAN" },
    { id: 421, title: "We are living, we are dwelling", tune: "AUSTRIAN HYMN" },
    { id: 422, title: "March on, O soul, with strength!", tune: "ARTHUR'S SEAT" },
    { id: 423, title: "Arise, O youth of God!", tune: "LEAVELL" },
    { id: 424, title: "Work, for the night is coming", tune: "WORK SONG" },
    { id: 425, title: "I'll Go Where You Want Me to Go", tune: "MANCHESTER" },
    { id: 426, title: "O Master, let me walk with Thee", tune: "MARYTON" },
    { id: 427, title: "The Master hath come", tune: "ASH GROVE" },
    { id: 428, title: "Must Jesus bear the cross alone", tune: "MAITLAND" },
    { id: 429, title: "Bring Them In", tune: "SHEPHERD" },
    { id: 430, title: "Must I go, and empty-handed", tune: "PROVIDENCE" },
    { id: 431, title: "Make Me a Blessing", tune: "SCHULER" },
    { id: 432, title: "Bringing In the Sheaves", tune: "HARVEST" },
    { id: 433, title: "The King Business", tune: "CASSEL" },
    { id: 434, title: "\"Serve the Lord with gladness\"", tune: "LEE" },
    { id: 435, title: "To the work! to the work! God", tune: "TOILING ON" },
    { id: 436, title: "Satisfied with Jesus", tune: "ROUTH" },
    { id: 437, title: "Our Best", tune: "TULLAR" },
    { id: 438, title: "Make Me a channel of blessing!", tune: "EUCLID" },
    { id: 439, title: "Ready to suffer grief or pain", tune: "TILLMAN" },
    { id: 440, title: "Hark, the voice of Jesus calling", tune: "ELLESDIE" },
    { id: 441, title: "O Master Workman of the race", tune: "AMESBURY" },
    { id: 442, title: "The light of God is falling", tune: "MISSIONARY HYMN" },
    { id: 443, title: "In Christ there is no East or West", tune: "ST. PETER" },
    { id: 444, title: "Let there be light, Lord God of hosts", tune: "PENTECOST" },
    { id: 445, title: "Rise up, O men of God!", tune: "ST. THOMAS" },
    { id: 446, title: "Fling out the banner! let it float", tune: "WALTHAM" },
    { id: 447, title: "O brother man, fold to thy heart thy brother!", tune: "ILONA" },
    { id: 448, title: "The morning light is breaking", tune: "WEBB" },
    { id: 449, title: "From Greenland's icy mountains", tune: "MISSIONARY HYMN" },
    { id: 450, title: "From ocean unto ocean", tune: "LANCASHIRE" },
    { id: 451, title: "O Zion, haste, thy mission, high fulfilling", tune: "TIDINGS" },
    { id: 452, title: "Heralds of Christ, who bear the King's commands", tune: "NATIONAL HYMN" },
    { id: 453, title: "Hail to the brightness of Zion's glad morning!", tune: "WESLEY" },
    { id: 454, title: "Light of the world, we hail Thee", tune: "SALVE DOMINE" },
    { id: 455, title: "We've a story to tell to the nations", tune: "MESSAGE" },
    { id: 456, title: "O God, we pray for all mankind", tune: "ORTONVILLE" },
    { id: 457, title: "Send the Light", tune: "McCABE" },
    { id: 458, title: "Christ for the world we sing", tune: "CUTTING" },
    { id: 459, title: "Ye Christian heralds! go", tune: "DUKE STREET" },
    { id: 460, title: "Father in heaven, who lovest all", tune: "SAXBY" },
    { id: 461, title: "Thou, whose almighty word", tune: "ITALIAN HYMN (TRINITY)" },
    { id: 462, title: "Watchman! tell us of the night", tune: "ST. GEORGE'S, WINDSOR" },
    { id: 463, title: "Forward through the ages", tune: "ST. GERTRUDE" },
    { id: 464, title: "Where cross the crowded ways of life", tune: "GERMANY" },
    { id: 465, title: "God of grace and God of glory", tune: "CWM RHONDDA" },
    { id: 466, title: "O Jesus, Master, when today", tune: "HUMILITY" },
    { id: 467, title: "Hear, hear, O ye Nations, and hearing, obey", tune: "JOANNA" },
    { id: 468, title: "When I can read my title clear", tune: "PISGAH" },
    { id: 469, title: "Hark, hark, my soul! angelic songs are swelling", tune: "PILGRIMS" },
    { id: 470, title: "Will There Be Any Star", tune: "STARS IN MY CROWN" },
    { id: 471, title: "There's a land that is fairer than day", tune: "SWEET BY AND BY" },
    { id: 472, title: "My Saviour First of All", tune: "I SHALL KNOW HIM" },
    { id: 473, title: "When the Morning Comes", tune: "BY AND BY" },
    { id: 474, title: "We Shall See the King Someday", tune: "JONES" },
    { id: 475, title: "Face to face with Christ, my Saviour", tune: "FACE TO FACE" },
    { id: 476, title: "Ten thousand times ten thousand", tune: "ALFORD" },
    { id: 477, title: "Jerusalem, the golden", tune: "EWING" },
    { id: 478, title: "On Jordan's stormy banks I stand", tune: "O'KANE" },
    { id: 479, title: "On Jordan's stormy banks I stand", tune: "PROMISED LAND" },
    { id: 480, title: "O think of the home over there", tune: "HOME OVER THERE" },
    { id: 481, title: "Shall we gather at the river", tune: "HANSOM PLACE" },
    { id: 482, title: "When the Roll is Called up Yonder", tune: "ROLL CALL" },
    { id: 483, title: "When We All Get to Heaven", tune: "HEAVEN" },
    { id: 484, title: "O they tell me of a home far beyond the skies", tune: "THE UNCLOUDED DAY" },
    { id: 485, title: "O That Will Be Glory", tune: "GLORY SONG" },
    { id: 486, title: "The Star-Spangled Banner", tune: "NATIONAL ANTHEM" },
    { id: 487, title: "My country, 'tis of thee", tune: "AMERICA" },
    { id: 488, title: "Mine eyes have seen the glory", tune: "BATTLE HYMN" },
    { id: 489, title: "America the Beautiful", tune: "MATERNA" },
    { id: 490, title: "Come, ye thankful people, come", tune: "ST. GEORGE'S WINDSOR" },
    { id: 491, title: "Now thank we all our God", tune: "NUN DANKET" },
    { id: 492, title: "We gather together", tune: "KREMSER" },
    { id: 493, title: "We plow the fields and scatter", tune: "ST. ANSLEM" },
    { id: 494, title: "Thanksgiving Hymn", tune: "LYONS" },
    { id: 495, title: "For all the blessings of the year", tune: "OLDBRIDGE" },
    { id: 496, title: "Ring out the old, ring in the new", tune: "WALTHAM" },
    { id: 497, title: "Another year is dawning", tune: "AURELIA" },
    { id: 498, title: "Father, let me dedicate", tune: "NEW YEAR" },
    { id: 499, title: "Dedicatory Hymn (To Him Who Hallows)", tune: "ELLACOMBE" },
    { id: 500, title: "Anniversary Hymn (O God of our fathers)", tune: "KREMSER" },
    { id: 501, title: "O Perfect Love", tune: "O PERFECT LOVE" },
    { id: 502, title: "The Voice That Breathed O'er Eden", tune: "BLAIRGOWRIE" },
    { id: 503, title: "Gracious Saviour, Who Didst Honor", tune: "MOTHERHOOD" },
    { id: 504, title: "O Blessed Day of Motherhood!", tune: "MATER" },
    { id: 505, title: "Tell Me the Stories of Jesus", tune: "STORIES OF JESUS" },
    { id: 506, title: "I Think When I Read That Sweet Story", tune: "SWEET STORY" },
    { id: 507, title: "With Happy Voices Ringing", tune: "BERTHOLD" },
    { id: 508, title: "What Can I Give to Jesus", tune: "DEDICATION" },
    { id: 509, title: "I Am So Glad that Our Father", tune: "JESUS LOVES EVEN ME" },
    { id: 510, title: "Gentle Jesus, Meek and Mild", tune: "SEYMOUR" },
    { id: 511, title: "Praise Him, All Ye Little Children", tune: "GOD IS LOVE" },
    { id: 512, title: "Jesus Loves Me", tune: "CHINA" },
    { id: 513, title: "The Wise May Bring Their Learning", tune: "ELLON" },
    { id: 514, title: "Doxology", tune: "OLD 100TH" },
    { id: 515, title: "The Lord Is in His Holy Temple", tune: "QUAM DILECTA" },
    { id: 516, title: "The Lord Is in His Holy Temple", tune: "SHAWNEE" },
    { id: 517, title: "O Father, Unto Thee", tune: "Unknown" },
    { id: 518, title: "Create in Me a Clean Heart", tune: "Unknown" },
    { id: 519, title: "We Would Worship Thee", tune: "Unknown" },
    { id: 520, title: "O Lord of Love, Thou Light Divine", tune: "VICTORY" },
    { id: 521, title: "O Worship the Lord", tune: "PORTER" },
    { id: 522, title: "Lead Me, Lord", tune: "Unknown" },
    { id: 523, title: "Spirit of the Living God", tune: "Unknown" },
    { id: 524, title: "Glory Be to the Father", tune: "GLORIA PATRI (First setting)" },
    { id: 525, title: "Glory Be to the Father", tune: "GLORIA PATRI (Second Setting)" },
    { id: 526, title: "Glory Be to the Father", tune: "GLORIA PATRI (Third setting)" },
    { id: 527, title: "Now For Each Yearning Heart", tune: "Unknown" },
    { id: 528, title: "In Jesus' Name We Pray", tune: "Unknown" },
    { id: 529, title: "Almighty Father, Hear Our Prayer", tune: "Unknown" },
    { id: 530, title: "Hear Our Prayer, O Lord", tune: "Unknown" },
    { id: 531, title: "Hear Our Prayer, O Heavenly Father", tune: "Unknown" },
    { id: 532, title: "Let the Words of My Mouth", tune: "Unknown" },
    { id: 533, title: "Bless Thou the Gifts", tune: "CANONBURY" },
    { id: 534, title: "All Things Come of Thee", tune: "Unknown" },
    { id: 535, title: "We Give Thee But Thine Own", tune: "ST. ANDREW" },
    { id: 536, title: "All Things Are Thine", tune: "HERR JESU CHRIST" },
    { id: 537, title: "Grant Us, Lord, the Grace of Giving", tune: "STUTTGART" },
    { id: 538, title: "May the Grace of Christ Our Saviour", tune: "DORRNANCE" },
    { id: 539, title: "Grace, Love and Peace Abide", tune: "MERIDIAN" },
    { id: 540, title: "Benediction", tune: "BRYSON CITY" },
    { id: 541, title: "The Lord Bless Thee and Keep Thee", tune: "Unknown" },
    { id: 542, title: "The Lord Bless You and Keep You", tune: "Unknown" },
    { id: 543, title: "Amen (Dresden)", tune: "DRESDEN" },
    { id: 544, title: "Amen (Threefold)", tune: "THREEFOLD" },
    { id: 545, title: "Amen (Threefold Traditional)", tune: "THREEFOLD" },
    { id: 546, title: "Amen (Fourfold)", tune: "FOURFOLD" },
    { id: 547, title: "Amen (Sevenfold)", tune: "SEVENFOLD" },
    { id: 548, title: "Amen (St. Peter)", tune: "ST. PETER" },
    { id: 549, title: "Amen (Cholmondely)", tune: "CHOLMONDELY" },
    { id: 550, title: "Amen (Gunner)", tune: "GUNNER" },
    { id: 551, title: "Amen (Pacem)", tune: "PACEM" },
    { id: 552, title: "Amen (Restare)", tune: "RESTARE" },
    { id: 553, title: "Amen (The Bell Cadence)", tune: "THE BELL CADENCE" },
    { id: 554, title: "Amen (Finir)", tune: "FINIR" },
    { id: 555, title: "For All the Saints", tune: "SINE NOMINE" },
    { id: 556, title: "Jesus Lives!", tune: "ST. ALBINUS" },
    { id: 557, title: "Thine For Ever!", tune: "NEWINGTON" },
    { id: 558, title: "For Ever with the Lord", tune: "NEARER HOME" },
    { id: 559, title: "Wait, and Murmur Not!", tune: "WAIT AND MURMUR NOT" },
    { id: 560, title: "Asleep in Jesus!", tune: "REST" },
    { id: 561, title: "The Christian's \"Good-Night\"", tune: "GOOD NIGHT" },
    { id: 562, title: "O Father, All Creating", tune: "AURELIA" },
    { id: 563, title: "O God of Love, to Thee We Bow", tune: "SAFFRON WALDEN" },
    { id: 564, title: "We All Have Gathered Here in Joy", tune: "ST. PETER" },
    { id: 565, title: "Gracious Lord on These Thy Servants", tune: "AUSTRIA" },
    { id: 566, title: "The Voice That Breathed O'er Eden", tune: "MATRIMONY" },
    { id: 567, title: "Through the Love of God Our Saviour", tune: "SOUTHGATE" },
    { id: 568, title: "Lord of Life Who Once was Cradled", tune: "ST. THOMAS(2)" },
    { id: 569, title: "Gracious Saviour, Gentle Shepherd", tune: "ROUSSEAU" },
    { id: 570, title: "Christ Who Welcomed Little Children", tune: "SHARON" },
    { id: 571, title: "Lord of Life", tune: "MANNHEIM" },
    { id: 572, title: "O Happy Home, Where Thou Art Loved the Dearest", tune: "WELWYN" }
  ];
  
  // Filter hymns based on search term
  const filteredHymns = allHymns.filter(hymn => 
    hymn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hymn.id.toString().includes(searchTerm) ||
    (hymn.tune && hymn.tune.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Calculate total number of pages
  const totalPages = Math.ceil(filteredHymns.length / hymnsPerPage);
  
  // Get current hymns for the page
  const indexOfLastHymn = currentPage * hymnsPerPage;
  const indexOfFirstHymn = indexOfLastHymn - hymnsPerPage;
  const currentHymns = filteredHymns.slice(indexOfFirstHymn, indexOfLastHymn);
  
  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={`edition-page theme-${theme}`}>
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={handleGoBack}>
          <span className="icon">←</span>
        </button>
        <div className="header-spacer"></div>
      </div>
      
      <div className="edition-topic-section">
        <div className="edition-header-stacked">
          <div className="edition-title">1956 Baptist Hymnal</div>
          <div className="edition-topic">Southern Baptist Convention</div>
        </div>
      </div>
      
      <div className="edition-meta">
        <span>Published: 1956</span>
        <span className="meta-separator">•</span>
        <span>Publisher: Convention Press</span>
      </div>
      
      <div className="edition-meta">
        <span>Hymns: 572</span>
        <span className="meta-separator">•</span>
        <span>Editor: W. Hines Sims</span>
        <span className="meta-separator">•</span>
        <button className="history-toggle" onClick={toggleHistory}>
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>
      
      {showHistory && (
        <div className="edition-history-box">
          <p>The 1956 Baptist Hymnal was the standard hymnal for Southern Baptist churches for nearly two decades. It featured a blend of traditional hymns and gospel songs popular in the mid-20th century.</p>
        </div>
      )}
      
      <div className="hymn-list-section">
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search hymns, numbers, or tunes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        
        <div className="pagination">
          <button 
            className="pagination-button" 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
          
          <button 
            className="pagination-button" 
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
        
        <div className="hymn-grid">
          {currentHymns.map(hymn => (
            <Link to={`/hymn/${hymn.id}`} key={hymn.id} className="hymn-card">
              <div className="hymn-number">{hymn.id}</div>
              <div className="hymn-title">{hymn.title}</div>
              <button 
                className={`favorite-button ${favorites.includes(hymn.id) ? 'active' : ''}`}
                onClick={(e) => toggleFavorite(e, hymn.id)}
              >
                <span className="favorite-icon">
                  {favorites.includes(hymn.id) ? '★' : '☆'}
                </span>
              </button>
            </Link>
          ))}
        </div>
        
        {filteredHymns.length === 0 && (
          <div className="no-results">
            <p>No hymns found matching your search.</p>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default Edition1956;