import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { responsiveReadings, yorubaResponsiveReadings, igboResponsiveReadings, hausaResponsiveReadings } from '../data/responsiveReadings';
import './Edition.css';
import './HymnList.css';
import { useSettings } from '../context/SettingsContext';

const GUIDE_CONTENT = {
  english: {
    mainTitle: "Responsive Readings",
    searchPlaceholder: "Search readings...",
    pageLabel: "Page",
    ofLabel: "of",
    noResults: "No readings found matching",
    title: "How to Use the Responsive Readings",
    intro1: "Reading the Scriptures should have an important place in a worship service. God's Word should be read with reverence and discernment and effectiveness, as an aid to worship and as a vital part of worship. Therefore, the wise use of the responsive readings can serve to unite a congregation in a corporate experience of holy communion with God.",
    intro2: "The following suggestions are offered to lead to a meaningful use of the responsive readings:",
    items: [
      "Plan to use the readings in various worship services—not only in the Sunday morning worship hour, but in less formal services on Sunday and on week days.",
      "Select the reading with concern for its appropriateness. It should relate to the hymns, the chief emphasis in the prayers, the content of the sermon, and the over-all purpose of the service.",
      "Introduce the responsive reading with a brief comment, if necessary, to motivate a purposeful participation by the congregation.",
      "Encourage all the members of the congregation to join in the reading of the selection.",
      "Guide the congregation to read with deliberateness, but with feeling, in order that the truths of the passage may register with full meaning.",
      "Vary, when deemed advantageous, the plan for the responses. The pastor and the congregation, the choir and the congregation, or two parts of the congregation may read responsively; or all may read the entire passage in unison.",
      "Never use a reading merely to occupy time or in lieu of reading which may be the background of the sermon. Let the responsive reading have its own inherent value for an experience of spiritual worship.",
      "Remember always that through Bible reading God speaks to the minds and hearts of needy souls. Thus we hear God's voice and come to feel that he is with us, that he is the supreme object of our devotion, and that we are the supreme objects of his love."
    ]
  },
  yoruba: {
    mainTitle: "Àwọn Ẹ̀kọ́ Kíkà",
    searchPlaceholder: "Wá ẹ̀kọ́ kíkà...",
    pageLabel: "Ojú-ewé",
    ofLabel: "nínú",
    noResults: "A kò rí ẹ̀kọ́ kíkà tí ó jọ",
    title: "Bí A Ti Ń Lo Àwọn Ẹ̀kọ́ Kíkà",
    intro1: "Kíkà Ọ̀rọ̀ Ọlọ́run gbọ́dọ̀ ní ipò pàtàkì nínú ìsìn. Ó yẹ kí a fi ìbọ̀wọ̀, ìmọ̀, àti agbára ka Ọ̀rọ̀ Ọlọ́run, gẹ́gẹ́ bí ìrànlọ́wọ́ fún ìsìn àti gẹ́gẹ́ bí apá pàtàkì nínú ìsìn. Nítorí náà, lílo àwọn ẹ̀kọ́ kíkà pẹ̀lú ọgbọ́n lè wúlò láti so ìjọ pọ̀ nínú ìrírí ìdàpọ̀ mímọ́ pẹ̀lú Ọlọ́run.",
    intro2: "A ń fi àwọn ìmọ̀ràn wọ̀nyí sílẹ̀ láti mú kí lílo àwọn ẹ̀kọ́ kíkà ní ìtumọ̀:",
    items: [
      "Ẹ gbèrò láti lo àwọn ẹ̀kọ́ kíkà nínú onírúurú àwọn ìsìn—kì í ṣe nínú ìsìn òwúrọ̀ ọjọ́ Àìkú nìkan, ṣùgbọ́n nínú àwọn ìsìn mìíràn ní ọjọ́ Àìkú àti láwọn ọjọ́ ọ̀sẹ̀.",
      "Ẹ yan ẹ̀kọ́ kíkà pẹ̀lú àkíyèsí pé ó bá ìsìn mu. Ó yẹ kí ó ní ìbámu pẹ̀lú àwọn orin, kókó àdúrà, àkóónú ìwàásù, àti gbogbo èròǹgbà ìsìn náà.",
      "Ẹ ṣe ìfáára ẹ̀kọ́ kíkà pẹ̀lú ọ̀rọ̀ kúkúrú, bí ó bá yẹ, láti gba ìjọ níyànjú láti kópa pẹ̀lú èròǹgbà.",
      "Ẹ gba gbogbo àwọn ọmọ ìjọ níyànjú láti kópa nínú kíkà ẹ̀kọ́ náà.",
      "Ẹ tọ́ ìjọ sọ́nà láti ka pẹ̀lú ìfọ̀kànbalẹ̀, ṣùgbọ́n pẹ̀lú ìmọ̀lára, kí òtítọ́ inú ẹsẹ ìwé mímọ́ náà lè ní ìtumọ̀ kíkún.",
      "Ẹ yí ọ̀nà kíkà padà, nígbà tí ó bá dára. Olùṣọ́-àgùntàn àti ìjọ, akọrin àti ìjọ, tàbí apá méjì ìjọ lè ka á ní amsa-amsa; tàbí kí gbogbo ìjọ ka gbogbo rẹ̀ papọ̀.",
      "Ẹ má ṣe lo ẹ̀kọ́ kíkà lásán láti fi pa àkókò tàbí láti rọ́pò kíkà tí ó lè jẹ́ ìpìlẹ̀ṣẹ̀ fún ìwàásù. Ẹ jẹ́ kí ẹ̀kọ́ kíkà ní iye ti ara rẹ̀ fún ìrírí ìsìn ti ẹ̀mí.",
      "Ẹ rántí nígbàgbogbo pé nípa kíkà Bíbélì, Ọlọ́run ń bá ọkàn àti ayà àwọn oníní-lílò sọ̀rọ̀. Báyìí ni a ń gbọ́ ohùn Ọlọ́run tí a sì ń wá láti mọ̀ pé Ó wà pẹ̀lú wa, pé Òun ni ohun tí a ń fi ìfọkànsìn wa fún, àti pé àwa ni ohun tí ìfẹ́ Rẹ̀ wà lórí."
    ]
  },
  hausa: {
    mainTitle: "Karatun Amsa-Amsa",
    searchPlaceholder: "Nemi karatu...",
    pageLabel: "Shafi",
    ofLabel: "na",
    noResults: "Ba a sami karatu mai kama da",
    title: "Yadda Za A Yi Amfani Da Karatun Amsa-Amsa",
    intro1: "Karatun Nassosi yana da matsayi mai muhimmanci a cikin ibada. Ya kamata a karanta Kalmar Allah da girmamawa, da fahimta, da kuma tasiri, a matsayin taimako ga ibada kuma a matsayin sashe mai mahimmanci na ibada. Saboda haka, yin amfani da hikima na karatun amsa-amsa zai iya taimakawa wajen haɗa ikilisiya cikin tarayya mai tsarki da Allah.",
    intro2: "Ana ba da waɗannan shawarwari don yin amfani da karatun amsa-amsa mai ma'ana:",
    items: [
      "Ku shirya yin amfani da karatun a cikin ibadu daban-daban—ba kawai a ibadar safiyar Lahadi ba, har ma a sauran ibadu na Lahadi da na ranakun mako.",
      "Ku zaɓi karatun da ya dace. Ya kamata ya dace da waƙoƙi, da jigon addu'o'i, da abin da wa'azi ya ƙunsa, da kuma manufar ibadar gaba ɗaya.",
      "Ku gabatar da karatun amsa-amsa tare da ɗan bayani, idan ya zama dole, don karfafa ikilisiya su shiga ciki da manufa.",
      "Ku karfafa duk membobin ikilisiya su shiga cikin karatun.",
      "Ku jagoranci ikilisiya su yi karatu a natse, amma tare da ji a rai, domin gaskiyar nassin ta sami cikakkiyar ma'ana.",
      "Ku canza salon karatun lokacin da ya dace. Fasto da ikilisiya, ko ƙungiyar mawaƙa da ikilisiya, ko ɓangarori biyu na ikilisiya suna iya karantawa bi da bi; ko kuma kowa ya karanta nassin gaba ɗaya tare.",
      "Kada ku yi amfani da karatu kawai don cike lokaci ko a maimakon karatun da zai zama tushen wa'azi. Bari karatun amsa-amsa ya kasance da darajarsa ta kansa don samun gogewa ta ibada ta ruhaniya.",
      "Ku tuna koyaushe cewa ta wurin karatun Littafi Mai Tsarki, Allah yana magana da hankali da zukatan masu bukata. Haka muke jin muryar Allah kuma mu fahimci cewa yana tare da mu, cewa Shi ne abin bautarmu mafi girma, kuma mu ne abin ƙaunarsa mafi girma."
    ]
  },
  igbo: {
    mainTitle: "Ọgụgụ Nzaghachi",
    searchPlaceholder: "Chọọ ọgụgụ...",
    pageLabel: "Ibè",
    ofLabel: "nke",
    noResults: "Enweghị ọgụgụ dabara na",
    title: "Otu E Si Eji Ọgụgụ Nzaghachi Eme Ihe",
    intro1: "Ọgụgụ nke Akwụkwọ Nsọ kwesịrị inwe ọnọdụ dị mkpa n'ofufe. E kwesịrị iji nkwanye ùgwù, nghọta, na ịdị irè gụọ Okwu Chineke, dị ka enyemaka maka ofufe na dị ka akụkụ dị mkpa nke ofufe. Ya mere, iji ọgụgụ nzaghachi eme ihe n'ụzọ amamihe nwere ike inye aka jikọọ ọgbakọ n'ime ahụmahụ nke nmekọrịta dị nsọ ha na Chineke.",
    intro2: "A na-enye aro ndị a iji duga n'iji ọgụgụ nzaghachi eme ihe n'ụzọ bara uru:",
    items: [
      "Hazie iji ọgụgụ ndị a mee ihe n'ofufe dị iche iche—ọ bụghị naanị n'ofufe ụtụtụ Sọnde, kamakwa n'ofufe ndị ọzọ na Sọnde na n'ụbọchị izu.",
      "Họrọ ọgụgụ nke dabara adaba. O kwesịrị ịdaba n'abụ, isi ihe dị n'ekpere, ihe dị n'oziọma, na ebumnuche ofufe ahụ n'ozuzu ya.",
      "Jiri okwu mmalite dị mkpirikpi webata ọgụgụ nzaghachi ahụ, ma ọ bụrụ na ọ dị mkpa, iji kpalie ọgbakọ isonye na ya n'ụzọ nwere ebumnuche.",
      "Gbaa ndị niile nọ n'ọgbakọ ume isonye n'ọgụgụ ahụ.",
      "Duru ọgbakọ ka ha jiri nwayọọ gụọ ihe, mana nwee mmetụta, ka eziokwu nke akụkụ Akwụkwọ Nsọ ahụ wee nwee nghọta zuru oke.",
      "Gbanwee usoro nzaghachi ahụ mgbe ọ dị mkpa. Onye ọzụzụ atụrụ na ọgbakọ, ndị ukwe na ọgbakọ, ma ọ bụ akụkụ abụọ nke ọgbakọ nwere ike ịgụ ya n'ụzọ nzaghachi; ma ọ bụ mmadụ niile nwere ike ịgụkọta akụkụ ahụ dum ọnụ.",
      "Ejila ọgụgụ eme ihe naanị iji mejuo oge ma ọ bụ n'ọnọdụ ọgụgụ nke nwere ike ịbụ ndabere nke oziọma. Kwe ka ọgụgụ nzaghachi nwee uru nke ya maka ahụmahụ nke ofufe ime mmụọ.",
      "Cheta mgbe niile na site n'ọgụgụ Baịbụl, Chineke na-agwa uche na obi nke mkpụrụ obi nwere mkpa okwu. N'ihi ya, anyị na-anụ olu Chineke ma bịa nwee mmetụta na O nọnyeere anyị, na Ọ bụ Ya ka anyị na-efe ofufe, na anyị bụ ndị O nwere oke ịhụnanya n'ebe ha nọ."
    ]
  }
};

function ResponsiveReading({ theme }) {
  const [showGuide, setShowGuide] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { language: settingsLanguage } = useSettings();
  const [language, setLanguage] = useState('english');
  const ITEMS_PER_PAGE = 40;

  useEffect(() => {
    const savedLang = localStorage.getItem('responsiveReadingLanguage');
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
    localStorage.setItem('responsiveReadingLanguage', language);
  }, [language]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, language]);

  const sourceReadings = language === 'english' ? responsiveReadings
    : language === 'yoruba' ? yorubaResponsiveReadings
      : language === 'igbo' ? igboResponsiveReadings
        : hausaResponsiveReadings;

  const filteredReadings = sourceReadings.filter(reading => {
    const term = searchTerm.toLowerCase();
    return (
      reading.title.toLowerCase().includes(term) ||
      reading.id.toString().includes(term) ||
      (reading.scripture && reading.scripture.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.ceil(filteredReadings.length / ITEMS_PER_PAGE);
  const currentReadings = filteredReadings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToNextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(p => Math.max(p - 1, 1));

  const content = GUIDE_CONTENT[language] || GUIDE_CONTENT.english;

  return (
    <div className={`edition-page theme-${theme}`} style={{ paddingBottom: '100px' }}>
      <div className="header-top-row">
        <Link to="/" className="back-button icon-only">
           <span className="icon">←</span>
        </Link>
        <h1>{content.mainTitle}</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            placeholder={content.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search-button"
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="settings-select"
          style={{ marginTop: '10px', maxWidth: '280px' }}
        >
          <option value="english">English</option>
          <option value="yoruba">Yoruba</option>
          <option value="igbo">Igbo</option>
          <option value="hausa">Hausa</option>
        </select>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-button"
            onClick={goToPrevPage} 
            disabled={currentPage === 1}
          >
            «
          </button>
          <div className="page-info">
            {content.pageLabel} {currentPage} {content.ofLabel} {totalPages}
          </div>
          <button 
            className="pagination-button"
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      )}
      
      <div className="edition-info-section" style={{ height: 'auto', maxHeight: 'none', marginBottom: '20px' }}>
        <div 
          onClick={() => setShowGuide(!showGuide)} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer',
            marginBottom: showGuide ? '10px' : '0'
          }}
        >
          <h2 style={{ textAlign: 'center', fontSize: '13px', fontWeight: 'bold', margin: 0 }}>
            {content.title}
          </h2>
          <span style={{ marginLeft: '10px', fontSize: '12px', color: '#888' }}>
            {showGuide ? '▲' : '▼'}
          </span>
        </div>
        
        {showGuide && (
          <div style={{ animation: 'fadeIn 0.3s ease-in', textAlign: 'justify', fontSize: '11px', lineHeight: '1.6', fontWeight: 'normal' }}>
            <p style={{ marginBottom: '15px' }}>
              {content.intro1}
            </p>
            <p style={{ marginBottom: '10px' }}>
              {content.intro2}
            </p>
            <ol style={{ paddingLeft: '20px', margin: 0 }}>
              {content.items.map((item, index) => (
                <li key={index} style={{ marginBottom: index === content.items.length - 1 ? '0' : '10px' }}>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      
      <div className="hymn-section">
        {filteredReadings.length === 0 ? (
          <div className="no-results" style={{ textAlign: 'center', padding: '20px' }}>
            <p>{content.noResults} "{searchTerm}"</p>
          </div>
        ) : (
          <div className="hymn-grid">
            {currentReadings.map(reading => (
              <Link to={`/reading/${reading.id}`} key={reading.id} className="hymn-card">
                <div className="hymn-number">{reading.id}</div>
                <div className="hymn-title">{reading.title}</div>
              </Link>
            ))}
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-button"
              onClick={goToPrevPage} 
              disabled={currentPage === 1}
            >
              «
            </button>
            <div className="page-info">
              {content.pageLabel} {currentPage} {content.ofLabel} {totalPages}
            </div>
            <button 
              className="pagination-button"
              onClick={goToNextPage} 
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResponsiveReading;
