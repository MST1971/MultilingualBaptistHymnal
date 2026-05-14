import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Edition.css';
import { useSettings } from '../context/SettingsContext';

function ChurchCovenant({ theme }) {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('hymnFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const getFavoriteId = () => `CC-1`; // Use a fixed ID since there's only one covenant

  const toggleFavorite = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const favoriteId = getFavoriteId();
    const newFavorites = favorites.includes(favoriteId)
      ? favorites.filter(favId => favId !== favoriteId)
      : [...favorites, favoriteId];
    
    setFavorites(newFavorites);
    localStorage.setItem('hymnFavorites', JSON.stringify(newFavorites));
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  const { language: settingsLanguage } = useSettings();
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const savedLang = localStorage.getItem('covenantLanguage');
    if (savedLang) {
      setLanguage(savedLang);
    } else if (settingsLanguage) {
      const normalized = String(settingsLanguage).toLowerCase();
      const mapped = normalized === 'english' ? 'english'
        : normalized === 'yoruba' ? 'yoruba'
        : normalized === 'igbo' ? 'igbo'
        : normalized === 'hausa' ? 'hausa'
        : 'english';
      setLanguage(mapped);
    }
  }, [settingsLanguage]);

  useEffect(() => {
    localStorage.setItem('covenantLanguage', language);
  }, [language]);

  const covenantContent = {
    english: {
      title: "The Church Covenant",
      intro: "Having been led, as we believe, by the Spirit of God, to receive the Lord Jesus Christ as our Savior, and on the profession of our faith, having been baptized in the name of the Father, and of the Son, and of the Holy Ghost, we do now, in the presence of God, angels, and this assembly, most solemnly and joyfully enter into covenant with one another, as one body in Christ.",
      points: [
        "We engage, therefore, by the aid of the Holy Spirit, to walk together in Christian love; to strive for the advancement of this church, in knowledge, holiness, and comfort; to promote its prosperity and spirituality; to sustain its worship, ordinances, discipline, and doctrines; to contribute cheerfully and regularly to the support of the ministry, the expenses of the church, the relief of the poor, and the spread of the gospel through all nations.",
        "We also engage to maintain family and secret devotions; to religiously educate our children; to seek the salvation of our kindred and acquaintances; to walk circumspectly in the world; to be just in our dealings, faithful in our engagements, and exemplary in our deportment; to avoid all tattling, backbiting, and excessive anger; to abstain from the sale and use of intoxicating drinks as a beverage, and to be zealous in our efforts to advance the kingdom of our Savior.",
        "We further engage to watch over one another in brotherly love; to remember each other in prayer; to aid each other in sickness and distress; to cultivate Christian sympathy in feeling and courtesy in speech; to be slow to take offense, but always ready for reconciliation, and mindful of the rules of our Savior to secure it without delay.",
        "We moreover engage that when we remove from this place we will, as soon as possible, unite with some other church, where we can carry out the spirit of this covenant and the principles of God's Word."
      ]
    },
    yoruba: {
      title: "Májẹ̀mú Ìjọ",
      intro: "Bí a ti gbà wa gbọ́ pé Ẹ̀mí Ọlọ́run ti tọ́ wa láti gba Jésù Kristi Olúwa gẹ́gẹ́ bí Olùgbàlà wa, àti lórí jíjẹ́wọ́ ìgbàgbọ́ wa, tí a sì ti baptisi wa ní orúkọ Baba, àti ti Ọmọ, àti ti Ẹ̀mí Mímọ́, àwa nísinsìyí, níwájú Ọlọ́run, àwọn áńgẹ́lì, àti ìjọ yìí, fi tọ́kàntọ́kàn àti ayọ̀ bá ara wa dá májẹ̀mú, gẹ́gẹ́ bí ara kan nínú Kristi.",
      points: [
        "Nítorí náà, a pinnu, nípasẹ̀ ìrànlọ́wọ́ Ẹ̀mí Mímọ́, láti rìn pọ̀ nínú ìfẹ́ Kristẹni; láti sàkún fún ìlòsíwájú ìjọ yìí, nínú ìmọ̀, ìwà mímọ́, àti ìtùnú; láti gbé ìdàgbàsókè àti ẹ̀mí rẹ̀ lárugẹ; láti dúró ti ìjosìn rẹ̀, àwọn ìlànà, ìbáwí, àti àwọn ẹ̀kọ́ rẹ̀; láti fi atinuwa àti déédéé ṣe ìtẹ́rẹ̀ fún ìtọ́jú iṣẹ́ ìránṣẹ́, àwọn ináwó ìjọ, ìrànlọ́wọ́ àwọn aláìní, àti ìtànkálẹ̀ ìhìnrere káàkiri gbogbo orílẹ̀-èdè.",
        "A tún pinnu láti pa ìsìn ilé àti ti ìkọ̀kọ̀ mọ́; láti kọ́ àwọn ọmọ wa ní ẹ̀kọ́ ẹ̀sìn; láti wá ìgbàlà àwọn ẹbí àti ojúlùmọ̀ wa; láti rìn ní ìwà pẹ̀lẹ́ nínú ayé; láti ṣe òtítọ́ nínú ìdúnà-adúrà wa, láti jẹ́ olódodo nínú ìlérí wa, àti láti jẹ́ àpẹẹrẹ rere nínú ìwà wa; láti yẹra fún gbogbo ìsòkúsò, ẹ̀hìn-kúlẹ̀-sọ̀rọ̀, àti ìbínú àṣẹ́jú; láti yẹra fún títà àti mímu àwọn ọtí mímu tí ń pa ní, àti láti ní ìtara nínú ipá wa láti gbé ìjọba Olùgbàlà wa lárugẹ.",
        "A tún pinnu láti má ṣe ìsòro lórí ara wa nínú ìfẹ́ ará; láti máa rántí ara wa nínú àdúrà; láti ràn ara wa lọ́wọ́ nínú àìsàn àti ìpọnjú; láti dàgbà nínú àánú Kristẹni àti ìwà rere nínú ọ̀rọ̀ sísọ; láti máa yára bínú, ṣùgbọ́n láti ṣe tán ní gbogbo ìgbà fún ìlàjá, àti láti rántí àwọn òfin Olùgbàlà wa láti mú un ṣe láìfàlẹ̀.",
        "A tún pinnu pé nígbà tí a bá kúrò ní àgbegbe yìí, a ó darapọ̀ mọ́ ìjọ míì ní kẹ́tẹ́kẹ́tẹ́ bí ó bá ti lè ṣeé ṣe, níbi tí a ó ti lè tẹ̀síwájú nínú ẹ̀mí májẹ̀mú yìí àti àwọn ìlànà Ọ̀rọ̀ Ọlọ́run."
      ]
    },
    igbo: {
      title: "Ọgbụgba Ndụ nke Ụka",
      intro: "Ebe anyị kwere na anyị site n’ndú-ọdọ nke Mmụọ Nsọ, nataworo Jizọs Kraịst dịka Onyenweanyị na Onye-nzọpụta anyị, ma site na nkwupụta nke okwukwe anyị, e wee mee anyị baptizim n’aha Nna, na nke Ọkpara, na nke Mmụọ Nsọ, anyị onwe anyị ugbu a, n’ihu Chineke, ndị mmụọ ozi, na ọgbakọ a, ji obi nsọ na ọṅụ banye n’ọgbụgba ndụ n’etiti onwe anyị, dịka otu ahụ n’ime Kraịst.",
      points: [
        "Ya mere, anyị na-ekwe nkwa, site n’enyemaka nke Mmụọ Nsọ, iji ịhụnanya nke Onye-Kraịst na-ebukọ; ịgba mbọ maka ịlòsíwájú nke ụka a, n’ịmụmụ, n’ịdị nsọ, na n’nkasi obi; iwulite ọganihu na ịdị n’ime mmụọ n’ime ya; ịkwado ofufe ya, ụkpụrụ ya, ịdọ aka ná ntị ya, na ozizi ya; iji obi ụtọ na mgbe niile na-enye onyinye maka ịkwado ozi, mmefu niile nke ụka, enyemaka nke ndị ogbenye, na mgbasa ozi ọma n’ụwa niile.",
        "Anyị na-ekwekwa nkwa ịkwado ofufe n’ezinụlọ na nke nzuzo; ịkụziri ụmụ anyị ụzọ Chineke; ịchọ nzọpụta nke ndị ikwu na ndị anyị na ha na-emekọrịta; iji nlezianya na-eje ije n’ụwa; ịbụ ndị ziri ezi n’azụmahịa anyị, bụrụ ndị ntụkwasị obi n’ụkpụrụ na nkwa anyị, bụrụkwa ihe atụ n’omume anyị; izere asịrị, ịkpọasị n’azụ, na iwe ókè; ịhapụ ire na iji ihe ọṅụṅụ na-egbu egbu dịka ihe ọṅụṅụ, na ịdị ọkụ n’ọrụ anyị iji kwalite alaeze Onye-nzọpụta anyị.",
        "Anyị na-ekwekwa nkwa ilekọta ibe anyị n’ịhụnanya ụmụnna; icheta ibe anyị n’ekpere; inyere ibe anyị aka n’ọrịa na n’ahụhụ; iwulite obi ebere nke Ndị Kraịst na ịkwanyere ibe anyị ùgwù n’okwu; ịdị nwayọọ n’iwe, ma bụrụ ndị njikere mgbe niile maka ime udo, na icheta iwu Onye-nzọpụta anyị ka e wee nweta ya n’enweghị oge.",
        "Anyị na-ekwekwa nkwa na mgbe anyị ga-esi n’ebe a pụọ, anyị ga-ejikọọ onwe anyị, ngwa ngwa ọ kwere mee, na ụka ọzọ, ebe anyị ga-enwe ike iburu mmụọ nke ọgbụgba ndụ a na ụkpụrụ nke Okwu Chineke n’ihu."
      ]
    },
    hausa: {
      title: "Alkawarin Ikilisiya",
      intro: "Da yake mun gaskata cewa Ruhu Mai Tsarki ya bishe mu, mu karbi Ubangiji Yesu Kristi a matsayin Mai Cetonmu, kuma bisa ga shaidar bangaskiyarmu, aka yi mana baftisma cikin sunan Uba, da na Da, da na Ruhu Mai Tsarki, yanzu muna, a gaban Allah, da mala'iku, da wannan taro, muna shiga alkawari da juna cikin girmamawa da farin ciki, a matsayin jiki daya cikin Kristi.",
      points: [
        "Saboda haka muna daukar alkawari, ta wurin taimakon Ruhu Mai Tsarki, mu yi tafiya tare cikin kaunar Kirista; mu yi kokari don ci gaban wannan ikilisiya, cikin ilimi, tsarki, da ta'aziyya; mu bunkasa wadatuwarta da ruhaniyarta; mu kiyaye ibadarta, ka'idodinta, ladabtarwarta, da koyarwarta; mu bayar da gudummawa cikin farin ciki da a kai a kai don tallafawa hidima, kudaden ikilisiya, taimakon talakawa, da yada bishara ga dukan al'ummai.",
        "Muna kuma daukar alkawari mu kiyaye ibadar iyali da ta boye; mu tarbiyyantar da yaranmu a addini; mu nemi ceto ga 'yan'uwanmu da abokanmu; mu yi tafiya cikin natsuwa a duniya; mu yi adalci a huldarmu, mu kasance masu aminci a alkawaranmu, kuma masu kyawawan halaye; mu guje wa dukan tsegumi, gulma, da yawan fushi; mu guje wa sayarwa da shan kayan maye, kuma mu kasance masu himma a kokarinmu na ciyar da mulkin Mai Cetonmu gaba.",
        "Muna kuma daukar alkawari mu kula da juna cikin kaunar 'yan'uwantaka; mu rika tunawa da juna a addu'a; mu taimaki juna a lokacin rashin lafiya da kunci; mu bunkasa tausayin Kirista da ladabi a magana; kada mu yi saurin fushi, amma a kullum mu kasance a shirye don sulhu, muna kiyaye dokokin Mai Cetonmu don samun hakan ba tare da bata lokaci ba.",
        "Muna kuma daukar alkawari cewa lokacin da muka tashi daga wannan wuri, za mu, da wuri-wuri, hada kai da wata ikilisiya, inda za mu iya ci gaba da ruhun wannan alkawari da ka'idodin Kalmar Allah."
      ]
    }
  };

  const currentContent = covenantContent[language] || covenantContent.english;

  return (
    <div className={`edition-page theme-${theme}`} style={{ paddingBottom: '100px' }}>
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={handleGoBack}>
          <span className="icon">←</span>
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1 style={{ fontSize: '18px', margin: 0 }}>{currentContent.title}</h1>
        </div>
        <button 
          className={`favorite-button ${favorites.includes(getFavoriteId()) ? 'active' : ''}`}
          onClick={toggleFavorite}
          title={favorites.includes(getFavoriteId()) ? "Remove from favorites" : "Add to favorites"}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px' }}
        >
          <span className="favorite-icon" style={{ fontSize: '20px', color: favorites.includes(getFavoriteId()) ? 'gold' : 'inherit' }}>
            {favorites.includes(getFavoriteId()) ? '★' : '☆'}
          </span>
        </button>
      </div>

      <div className="language-switch-container" style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="settings-select"
          style={{ maxWidth: '280px' }}
        >
          <option value="english">English</option>
          <option value="yoruba">Yoruba</option>
          <option value="igbo">Igbo</option>
          <option value="hausa">Hausa</option>
        </select>
      </div>
      
      <div className="covenant-content" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="icon-large" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <i className="fas fa-church"></i>
        </div>
        
        <p className="covenant-intro" style={{ 
          marginBottom: '20px', 
          fontStyle: 'italic',
          fontSize: '11px',
          lineHeight: '1.5',
          fontFamily: "'Merriweather', serif",
          textAlign: 'justify'
        }}>
          {currentContent.intro}
        </p>
        
        <div className="covenant-points">
          {currentContent.points.map((point, index) => (
            <p key={index} style={{ 
              marginBottom: '20px', 
              fontSize: '11px',
              lineHeight: '1.5',
              fontFamily: "'Merriweather', serif",
              textAlign: 'justify'
            }}>
              {point}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChurchCovenant;
