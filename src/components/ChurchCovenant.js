import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MinistersCompanion.css'; // Reusing styles
import { useSettings } from '../context/SettingsContext';

function ChurchCovenant({ theme }) {
  const navigate = useNavigate();
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
      title: "Majemu Ijo",
      intro: "Bi a ti gba wa gbo pe Emi Olorun ti to wa lati gba Jesu Kristi Oluwa gbo gege bi Olugbala wa, ati lori jewo igbagbo wa, ti a si ti baptisi wa ni oruko Baba, ati ti Omo, ati ti Emi Mimo, awa nisisiyi, ni iwaju Olorun, awon angeli, ati ijo yii, fi tọkàntọkàn ati ayo ba ara wa da majemu, gege bi ara kan ninu Kristi.",
      points: [
        "Nitorina a pinnu, nipase iranlowo Emi Mimo, lati rin papo ninu ife Kristiani; lati sakun fun ilosiwaju ijo yii, ninu imo, iwa mimo, ati itunu; lati gbe idagbasoke ati emi re laruge; lati duro ti ijosin re, awon ilana, ibawi, ati awon eko re; lati fi atinuwa ati deede se itore fun itoju ise iranse, awon inawo ijo, iranlowo awon alaini, ati itankale ihinrere kakiri gbogbo orile-ede.",
        "A tun pinnu lati pa isin ile ati ti ikoko mo; lati ko awon omo wa ni eko esin; lati wa igbala awon ebi ati ojulumo wa; lati rin ni iwa pele ninu aye; lati se otito ninu iduna-adura wa, lati jẹ olododo ninu ileri wa, ati lati jẹ apere rere ninu iwa wa; lati yera fun gbogbo isokuso, ehinkule-soro, ati ibinu aṣeju; lati yera fun tita ati mimu awon oti mimu ti n pa ni, ati lati ni itara ninu ipa wa lati gbe ijoba Olugbala wa laruge.",
        "A tun pinnu lati ma se isora lori ara wa ninu ife ara; lati ma ranti ara wa ninu adura; lati ran ara wa lowo ninu aisan ati iponju; lati dagba ninu aanu Kristiani ati iwa rere ninu oro sisọ; lati ma yara binu, sugbon lati seetan nigbagbogbo fun ilaja, ati lati ranti awon ofin Olugbala wa lati mu u se lai falẹ.",
        "A tun pinnu pe nigba ti a ba kuro ni aaye yii, a o darapo mọ ijo miiran ni kete bi o ba ti le seese, nibi ti a o ti le tesiwaju ninu emi majemu yii ati awon ilana Oro Olorun."
      ]
    },
    igbo: {
      title: "Ogbugba Ndu Nke Uka",
      intro: "Ebe anyi kwere na anyi site na ndu-odu nke Mo Nso, nataworo Jesu Kristi dika Onye-nwe-anyi na Onye-nzoputa anyi, ma site na nkwuputa nke okwukwe anyi, e wee mee anyi baptism n'aha nke Nna, na nke Opara, na nke Mo Nso, anyi n'onwe-anyi ugbu a, n'iru Chineke, na ndi-mmuo-ozi, na ogbako a, ji obi-nso na onu ba n'ogbugba-ndu n'etiti onwe-anyi, dika otu aru nime Kristi.",
      points: [
        "Ya mere, anyi na-ekwe nkwa, site n'enyemaka nke Mo Nso, iji ifunanya nke Onye-Kristi na-ebuko; igba mbo maka inogide n'iru nke uka a, na mmuta, na-iwi-aru-ocha, na nkasi-obi; iwulite uba na inu-oku nke Mo Nso nime ya; inogide n'ife-nru ya, na usoro ya nile, naadodo-nzi ya, na ozizi ya nile; iji obi-ocha na mgbe nile na-enye onyinye maka iji kwado ozi-oma, na mmefu nile nke uka, na enyemaka nke ndi-ogbenye, na mgbasa nke ozi-oma n'mba nile.",
        "Anyi na-ekwe kwa nkwa inogide n'ekpere ezi-na-ulo na nke nzuzo; izu umu-anyi n'uzo nke Chineke;icho nzoputa nke ndi-ikwu na ndi-ibe-anyi; iji nlezianya na-aga ije n'uwa; ime ezi-okwu n'ahia nile anyi na-azu, ikwu-wa-aka-oto n'nkwa nile anyi na-ekwe, na idi-nma n'agwa-anyi nile; izere asiri nile, na nkwuto, na iwe-oku; izere ire na inu mmanya na-egbu egbu dika ihe-onunu, na inu-oku n'ike-anyi nile iji kwalite alaeze nke Onye-nzoputa anyi.",
        "Anyi na-ekwe kwa nkwa ilekolo onwe-anyi anya n'ifunanya umu-nna; icheta onwe-anyi n'ekpere; inyere onwe-anyi aka na nrinu na mkpa; iwulite obi-ebere nke Onye-Kristi na nsopuru n'okwu-onunu; ka anyi ghara iwe-iwe ngwa ngwa, kama ka anyi di njikere mgbe nile maka udo, na-echeta iwu nile nke Onye-nzoputa anyi iji huta ya n'egbughi-oge.",
        "Anyi na-ekwe kwa nkwa na mgbe anyi ga-esi n'ebe a pua, na anyi ga-ejiko onwe-anyi, ngwa ngwa, na uka ozo, ebe anyi ga-enwe ike iwe-ghara mmụọ nke ogbugba-ndu a na usoro nile nke Okwu Chineke."
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
    <div className={`ministers-companion-page theme-${theme}`}>
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>{currentContent.title}</h1>
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
