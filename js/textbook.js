// Chapter-aligned practice for "The Earth and Its Peoples: A Global History" (Bulliet et al.), AP 6th edition.
// All questions and practice passages are original; quoted primary sources are short public excerpts.
// Questions are grouped into College Board–style sets that share a source.
// In each question, the FIRST option is correct; options are shuffled at display time.

const TEXTBOOK = {
  title: "The Earth and Its Peoples",
  edition: "AP 6th edition",
  chapters: [
    { num: 1, title: "Nature, Humanity, and History", dates: "to 3500 B.C.E.", unit: 0, sets: [] },
    { num: 2, title: "The First River-Valley Civilizations", dates: "3500–1500 B.C.E.", unit: 0, sets: [] },
    { num: 3, title: "The Mediterranean and Middle East", dates: "2000–500 B.C.E.", unit: 0, sets: [] },
    { num: 4, title: "New Civilizations Outside the West Asian Core", dates: "2300 B.C.E.–350 C.E.", unit: 0, sets: [] },
    { num: 5, title: "Greece and Iran", dates: "1000–30 B.C.E.", unit: 0, sets: [] },
    { num: 6, title: "An Age of Empires: Rome and Han China", dates: "753 B.C.E.–330 C.E.", unit: 0, sets: [] },
    { num: 7, title: "India and Southeast Asia", dates: "1500 B.C.E.–1025 C.E.", unit: 0, sets: [] },
    { num: 8, title: "Networks of Communication and Exchange", dates: "300 B.C.E.–1100 C.E.", unit: 0, sets: [] },
    { num: 9, title: "The Sasanid Empire and the Rise of Islam", dates: "200–1200", unit: 0, sets: [] },
    { num: 10, title: "Christian Europe Emerges", dates: "300–1200", unit: 0, sets: [] },
    {
      num: 11, title: "Inner and East Asia", dates: "400–1200", unit: 1,
      sets: [
        {
          source: {
            kind: "Practice passage",
            text: "Under the Song dynasty, fast-ripening Champa rice, improved canal transport, and the spread of paper money stimulated commercial growth. Cities such as Kaifeng and Hangzhou grew into some of the largest in the world. Meanwhile, the civil service examination system, open in principle to men of most backgrounds, became the main path to official positions.",
            cite: "Written for this site, summarizing historians' interpretations of the Song economy",
          },
          questions: [
            { q: "The developments described in the passage most directly contributed to which of the following?",
              options: ["Song China's emergence as one of the most commercialized and urbanized societies of its time", "A decline in the influence of Confucian ideas on Chinese government", "Reduced Chinese demand for goods traded across the Indian Ocean", "The replacement of imperial rule with a system of regional warlords"],
              why: "Agricultural surpluses, better transport, and paper money fueled markets and large cities, making Song China highly commercialized." },
            { q: "The examination system mentioned in the passage most directly reflects which continuity in Chinese history?",
              options: ["The use of Confucian learning to select and train government officials", "Rule by a hereditary warrior aristocracy loyal to regional lords", "Reliance on Buddhist monasteries to administer the provinces", "The election of officials by local councils of merchants"],
              why: "Imperial China repeatedly used Confucian education and exams to staff its bureaucracy, a practice the Song expanded." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "Korea, Japan, and Vietnam adopted Chinese writing, Confucian political ideas, and Buddhist traditions. Yet Japanese aristocrats preserved hereditary rank rather than adopting examinations, and Vietnamese rulers resisted Chinese political control even while borrowing Chinese institutions.",
            cite: "Written for this site",
          },
          questions: [
            { q: "Which of the following best describes the pattern discussed in the passage?",
              options: ["Neighboring societies selectively adapted Chinese culture while preserving distinct traditions", "Chinese armies imposed identical institutions on all neighboring states", "East Asian states rejected Chinese culture in favor of Islamic learning", "Chinese influence was limited to the spread of new food crops"],
              why: "Cultural borrowing in East Asia was selective: neighbors adopted Chinese models but adapted them to local political and social structures." },
          ],
        },
      ],
    },
    {
      num: 12, title: "Peoples and Civilizations of the Americas", dates: "600–1500", unit: 1,
      sets: [
        {
          source: {
            kind: "Practice passage",
            text: "The Inca state required subject communities to provide labor in rotation, building roads, agricultural terraces, and storehouses. Goods collected in state storehouses supported the army and officials and could be redistributed in times of shortage. A road network of thousands of miles linked the provinces to the capital at Cuzco.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The labor system described in the passage is most similar to which of the following?",
              options: ["Labor obligations that Afro-Eurasian states required of peasants for public works", "Wage labor in early industrial factories", "Chattel slavery on Caribbean sugar plantations", "Indentured servitude contracts of the nineteenth century"],
              why: "The mit'a, like corvée labor in many Afro-Eurasian states, required subjects to work on state projects as a form of tax." },
            { q: "Which feature described in the passage most directly helped the Inca govern a large territory?",
              options: ["An extensive road network connecting the provinces to the capital", "A system of coined money used in all transactions", "An alliance with Mexica rulers in central Mexico", "A navy that controlled Pacific coastal trade"],
              why: "Roads allowed the Inca to move armies, officials, messengers, and goods quickly across the Andes." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "The Mexica built their capital, Tenochtitlan, on islands in Lake Texcoco, growing food on raised fields called chinampas. Conquered city-states were left under local rulers but were required to send regular tribute such as cotton cloth, cacao, feathers, and captives.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The tribute system described in the passage most likely contributed to which later development?",
              options: ["Resentment among subject peoples, some of whom allied with the Spanish in the 1500s", "The rapid spread of Islam into central Mexico", "The decline of agriculture in the Valley of Mexico", "Mexica adoption of an Inca-style road system"],
              why: "Many peoples who resented Mexica tribute demands joined Cortés, which was crucial to the Spanish conquest." },
          ],
        },
      ],
    },
    {
      num: 13, title: "Mongol Eurasia and Its Aftermath", dates: "1200–1500", unit: 2,
      sets: [
        {
          source: {
            kind: "Practice passage",
            text: "Mongol rulers protected merchants, maintained a relay system of postal stations, and relocated artisans and scholars across their territories. Persian astronomers worked in Yuan China, while Chinese medical texts and printing techniques became known in Il-Khanid Iran.",
            cite: "Written for this site, summarizing historians' interpretations of Mongol rule",
          },
          questions: [
            { q: "The passage best supports which of the following claims?",
              options: ["Mongol rule facilitated the transfer of knowledge and technology across Eurasia", "Mongol rulers sought to isolate the regions they conquered from one another", "Mongol conquests ended long-distance trade on the Silk Roads", "Mongol rulers forced conquered peoples to adopt Mongol religion"],
              why: "By uniting much of Eurasia, the Mongols encouraged exchanges of people, goods, and ideas." },
            { q: "Which of the following was an unintended consequence of the connections described in the passage?",
              options: ["The spread of the bubonic plague across Eurasia in the 1300s", "The introduction of maize and potatoes into Eurasia", "The collapse of the Abbasid Caliphate's navy", "The spread of Protestantism into Central Asia"],
              why: "Increased movement along Mongol-protected routes helped spread the Black Death." },
            { q: "Which of the following best describes the aftermath of Mongol rule in China?",
              options: ["The Ming dynasty restored Han Chinese rule and revived Confucian institutions", "China was divided permanently among Mongol khanates", "The Yuan dynasty was succeeded by a Japanese shogunate", "China abandoned the civil service examination system"],
              why: "After expelling the Mongols in 1368, the Ming emphasized Han Chinese identity and Confucian government." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "The Golden Horde allowed Russian princes to keep their thrones as long as they collected and delivered tribute. The princes of Moscow became the Horde's chief tax collectors, and their wealth and influence grew.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The passage most directly helps explain which of the following?",
              options: ["The rise of Moscow as the center of a later Russian state", "The spread of Mongol rule into Western Europe", "The conversion of Russia to Islam", "The decline of the Orthodox Church in Russia"],
              why: "Serving as tribute collectors gave Moscow's princes resources that later let them challenge the Horde and build a Russian state." },
          ],
        },
      ],
    },
    {
      num: 14, title: "Tropical Africa and Asia", dates: "1200–1500", unit: 2,
      sets: [
        {
          source: {
            kind: "Primary source",
            text: "“[The people of Mali] possess some admirable qualities. They are seldom unjust, and have a greater abhorrence of injustice than any other people. Their sultan shows no mercy to anyone who is guilty of the least act of it. There is complete security in their country.”",
            cite: "Ibn Battuta, Moroccan Muslim scholar and traveler, describing his visit to Mali, c. 1352",
          },
          questions: [
            { q: "Ibn Battuta's ability to travel to Mali most directly reflects which of the following?",
              options: ["The expansion of networks linking the Islamic world across the Sahara", "Mongol control of trade routes in West Africa", "Portuguese exploration of the West African coast", "The spread of Christianity into the Sahel"],
              why: "Trans-Saharan trade routes and shared Islamic institutions allowed Muslim scholars like Ibn Battuta to travel and find support across Dar al-Islam." },
            { q: "The passage could best be used as evidence of which aspect of Mali?",
              options: ["Political stability that supported trans-Saharan commerce", "Mali's dependence on the Atlantic slave trade", "Conflict between Mali and the Mongol Empire", "Mali's rejection of Islam"],
              why: "Security and order made Mali attractive to merchants and supported the gold and salt trade." },
            { q: "Which of the following would a historian most likely consider when evaluating this source?",
              options: ["Ibn Battuta judged Mali partly by the standards of Islamic law and his own expectations", "Ibn Battuta wrote primarily to encourage European colonization of Mali", "Ibn Battuta had never traveled outside of West Africa", "Ibn Battuta was a government official of Mali"],
              why: "As a Muslim legal scholar from North Africa, Ibn Battuta's point of view shaped what he praised and criticized." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "Kilwa, on the Swahili coast, minted its own coins and built a great mosque and palace. Its rulers taxed the gold that came from the interior, near Great Zimbabwe, before it was shipped to Arabia, Persia, and India.",
            cite: "Written for this site",
          },
          questions: [
            { q: "Which of the following best explains the prosperity of Kilwa described in the passage?",
              options: ["Its position in Indian Ocean trade connecting the African interior to Asia", "Its control of trans-Saharan caravan routes", "Its role as a Portuguese colonial capital", "Its production of silk for European markets"],
              why: "Swahili city-states grew wealthy as intermediaries between interior producers and Indian Ocean merchants." },
          ],
        },
      ],
    },
    {
      num: 15, title: "The Latin West", dates: "1200–1500", unit: 1,
      sets: [
        {
          source: {
            kind: "Practice passage",
            text: "After the Black Death killed perhaps a third of Europe's population, labor became scarce. Wages rose in many regions, and lords who tried to force peasants back into old obligations faced revolts, such as the English Peasants' Revolt of 1381.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The passage best supports which of the following conclusions?",
              options: ["The plague weakened traditional manorial obligations in parts of Western Europe", "The plague strengthened serfdom throughout Western Europe", "The plague ended the use of money in European economies", "The plague caused Europeans to abandon urban life permanently"],
              why: "Labor shortages gave surviving peasants and workers more bargaining power, eroding manorialism in the West." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "Merchants and bankers in Italian city-states such as Florence and Venice, enriched by Mediterranean trade, paid for paintings, buildings, and the study of ancient Greek and Roman texts — many of which had been preserved and studied in the Byzantine and Islamic worlds.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The developments in the passage most directly contributed to which of the following?",
              options: ["The Italian Renaissance", "The Protestant Reformation's split with Rome", "The Crusaders' capture of Jerusalem", "The decline of Mediterranean trade"],
              why: "Commercial wealth and renewed interest in classical learning fueled the Renaissance." },
            { q: "The passage suggests that European intellectual life in this period was shaped by",
              options: ["exchanges with the Byzantine and Islamic worlds", "complete isolation from other regions", "the influence of Mongol scholars in Italy", "texts brought from the Americas"],
              why: "Classical texts preserved and translated in Byzantium and Dar al-Islam reached Western scholars through trade and contact." },
          ],
        },
      ],
    },
    {
      num: 16, title: "The Maritime Revolution", dates: "to 1550", unit: 4,
      sets: [
        {
          source: {
            kind: "Practice passage",
            text: "Zheng He's Ming fleets of the early 1400s, with hundreds of ships, visited ports from Southeast Asia to East Africa, collecting tribute and gifts before the voyages were halted. Later in the century, much smaller Portuguese fleets rounded Africa and soon seized ports such as Goa and Malacca, building forts to control trade.",
            cite: "Written for this site",
          },
          questions: [
            { q: "Which of the following best describes a difference between the voyages described?",
              options: ["Portuguese voyages sought to control trade through fortified ports, while Ming voyages emphasized displaying power and gathering tribute", "Ming voyages sought colonies, while Portuguese voyages avoided the use of force", "Portuguese voyages were larger and better funded than Ming voyages", "Ming voyages reached the Americas, while Portuguese voyages stayed in Europe"],
              why: "The Portuguese built a trading-post empire backed by naval force; the Ming fleets were diplomatic displays that did not found colonies." },
            { q: "Which of the following most directly enabled the Portuguese voyages described in the passage?",
              options: ["Ships such as the caravel and navigational tools such as the astrolabe", "Steam-powered ships and the telegraph", "Joint-stock companies founded in the 1700s", "An alliance with the Mughal Empire"],
              why: "Adapted technologies like the lateen-rigged caravel and the astrolabe, plus knowledge of Atlantic winds, made long ocean voyages possible." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "In the Treaty of Tordesillas (1494), Spain and Portugal agreed to a line dividing newly claimed lands outside Europe, with Portugal's sphere including the route to Asia around Africa and, as it turned out, the eastern part of South America.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The agreement described in the passage most directly reflects which of the following?",
              options: ["Competition among European states for overseas trade and territory", "Cooperation between Iberian states and the Ottoman Empire", "Indigenous American states negotiating with Europeans", "The decline of the Catholic Church's political influence"],
              why: "The treaty, mediated with papal backing, aimed to manage Iberian rivalry over newly reached lands." },
          ],
        },
      ],
    },
    {
      num: 17, title: "Transformations in Europe", dates: "1500–1750", unit: 3,
      sets: [
        {
          source: {
            kind: "Primary source",
            text: "“Why does not the pope, whose wealth is today greater than the wealth of the richest Crassus, build this one basilica of St. Peter with his own money rather than with the money of poor believers?”",
            cite: "Martin Luther, German monk, Ninety-Five Theses, 1517 (Thesis 86)",
          },
          questions: [
            { q: "The thesis most directly reflects which of the following developments?",
              options: ["Growing criticism of the Catholic Church's wealth and the sale of indulgences", "Efforts to reunite the Catholic and Orthodox churches", "Support for papal authority over secular rulers", "Opposition to the Ottoman expansion into Europe"],
              why: "Luther objected to indulgence sales used to fund St. Peter's Basilica, a key spark of the Reformation." },
            { q: "Which of the following most directly helped ideas like Luther's spread quickly?",
              options: ["The printing press", "The caravel", "The telegraph", "The Columbian Exchange"],
              why: "Printed pamphlets spread Reformation ideas rapidly across Europe." },
            { q: "Which of the following was a response to developments like those in the passage?",
              options: ["The Catholic Counter-Reformation, including the Council of Trent and the Jesuits", "The Tanzimat reforms", "The Meiji Restoration", "The Treaty of Tordesillas"],
              why: "The Catholic Church reformed abuses, clarified doctrine at Trent, and founded the Jesuits to spread Catholicism." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "Copernicus argued that the Earth orbits the sun, and Galileo used a telescope to support that view. Their claims relied on observation and mathematics rather than on the authority of ancient writers or the Church.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The developments in the passage are most closely associated with which of the following?",
              options: ["The Scientific Revolution", "The Columbian Exchange", "The Second Industrial Revolution", "The Protestant Reformation's doctrine of salvation"],
              why: "The Scientific Revolution emphasized observation and reason, laying groundwork for the Enlightenment." },
          ],
        },
      ],
    },
    {
      num: 18, title: "The Americas, the Atlantic, and Africa", dates: "1530–1770", unit: 4,
      sets: [
        {
          source: {
            kind: "Data",
            table: {
              caption: "Estimated enslaved Africans arriving in the Americas, 1501–1866 (rounded)",
              head: ["Region of arrival", "Arrivals"],
              rows: [["Brazil", "4.9 million"], ["British Caribbean", "2.3 million"], ["Spanish Americas", "1.3 million"], ["French Caribbean", "1.1 million"], ["Mainland North America", "0.4 million"]],
            },
            cite: "Adapted from Trans-Atlantic Slave Trade Database estimates",
          },
          questions: [
            { q: "The data best support which of the following conclusions?",
              options: ["Most enslaved Africans were taken to Brazil and the Caribbean rather than to North America", "Most enslaved Africans were taken to mainland North America", "The Spanish Americas received more enslaved Africans than any other region", "The slave trade to the Americas ended before 1600"],
              why: "Brazil and the Caribbean together received the large majority of arrivals; mainland North America received under 5%." },
            { q: "Which of the following best explains the pattern shown in the data?",
              options: ["High labor demand on sugar plantations, where harsh conditions caused high death rates", "Laws in Brazil that banned the use of Indigenous labor", "The absence of agriculture in the Caribbean", "The early abolition of slavery in Brazil"],
              why: "Sugar plantations demanded huge labor forces, and brutal conditions meant planters constantly imported more enslaved people." },
            { q: "Which of the following was an effect of the trade shown in the data on West Africa?",
              options: ["Some states, such as Dahomey, gained power by participating in the slave trade", "West African states were united under a single empire", "The population of West Africa grew rapidly", "West Africans stopped trading with Europeans entirely"],
              why: "Certain African states expanded by exchanging captives for firearms and goods, while the trade caused population loss and instability elsewhere." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "At Potosí, in the Andes, Spanish officials required Indigenous communities to send a share of their adult men to work in the silver mines for set periods, adapting a labor obligation that had existed under the Inca.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The passage describes which of the following?",
              options: ["The Spanish adaptation of the mit'a system for colonial mining", "The encomienda system's use on Caribbean sugar plantations", "Indentured servitude of Chinese laborers", "The hacienda system's free wage labor"],
              why: "The Spanish turned the Inca mit'a into a coerced labor draft for silver mining." },
            { q: "Silver produced at sites like Potosí most directly contributed to which of the following?",
              options: ["Increased global trade, as much of the silver flowed to China", "The decline of trade between Europe and Asia", "The end of Spain's role in the Americas", "The industrialization of the Andes in the 1600s"],
              why: "American silver was the key currency of early global trade, much of it ending up in Ming China." },
          ],
        },
      ],
    },
    {
      num: 19, title: "Southwest Asia and the Indian Ocean", dates: "1500–1750", unit: 3,
      sets: [
        {
          source: {
            kind: "Practice passage",
            text: "The Ottoman sultans took boys from Christian families in the Balkans, converted them to Islam, and trained them to serve as soldiers in the Janissary corps or as palace officials. Because they owed everything to the sultan, these servants had no independent family power base.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The practice described in the passage is known as",
              options: ["the devshirme system", "the zamindar system", "the encomienda system", "the tributary system"],
              why: "The devshirme recruited Christian boys to create a loyal military and administrative elite." },
            { q: "The practice described in the passage was primarily intended to",
              options: ["create officials and soldiers loyal directly to the sultan", "weaken the Ottoman military", "spread Christianity within the empire", "increase the power of Turkish landed nobles"],
              why: "Because they lacked independent ties, devshirme recruits were dependent on—and loyal to—the sultan." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "In 1514, Ottoman forces equipped with cannons and muskets defeated the army of the Safavid Shah Ismail at Chaldiran. The Safavids had made Shia Islam the official religion of Iran, while the Ottomans presented themselves as defenders of Sunni Islam.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The conflict described in the passage was intensified by",
              options: ["religious divisions between Sunni and Shia Islam", "competition for colonies in the Americas", "a dispute over Christian missionaries", "the Mughal invasion of Anatolia"],
              why: "Political rivalry between the two empires was framed in Sunni–Shia terms." },
            { q: "The outcome of the battle in the passage best illustrates which of the following?",
              options: ["The importance of gunpowder weapons in the expansion of land-based empires", "The decline of the Ottoman military", "The role of naval power in the Indian Ocean", "The spread of Shia Islam into the Balkans"],
              why: "Ottoman firearms and artillery gave them a decisive edge; gunpowder was central to these empires' power." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "The Mughal emperor Akbar abolished the jizya tax on non-Muslims, married Hindu princesses, and hosted debates among scholars of different faiths.",
            cite: "Written for this site",
          },
          questions: [
            { q: "Akbar's policies described in the passage were most likely intended to",
              options: ["strengthen his rule over a religiously diverse population", "convert the Hindu majority to Islam by force", "weaken ties with Rajput rulers", "align the Mughals with the Safavid Shia state"],
              why: "Religious tolerance helped Akbar win the loyalty of Hindu elites and subjects." },
          ],
        },
      ],
    },
    {
      num: 20, title: "Northern Eurasia", dates: "1500–1800", unit: 4,
      sets: [
        {
          source: {
            kind: "Primary source",
            text: "“Our Celestial Empire possesses all things in prolific abundance and lacks no product within its own borders. There was therefore no need to import the manufactures of outside barbarians in exchange for our own produce.”",
            cite: "Qianlong Emperor of China, letter to King George III of Britain, 1793",
          },
          questions: [
            { q: "The letter most directly reflects which of the following?",
              options: ["Qing confidence in China's self-sufficiency and its tributary view of foreign relations", "Qing eagerness to adopt British industrial technology", "Chinese dependence on European manufactured goods", "The Qing government's desire to colonize Britain"],
              why: "The emperor treated Britain as a tribute-bearing outsider and rejected expanded trade." },
            { q: "Which development in the following century most directly challenged the views expressed in the letter?",
              options: ["British victory in the Opium Wars and the imposition of unequal treaties", "The Ming dynasty's treasure fleets", "The spread of Buddhism to China", "The Mongol conquest of China"],
              why: "Britain used military force to open China to trade, overturning Qing control over foreign relations." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "Russian fur traders and Cossacks moved east across Siberia in the 1600s, building forts and demanding tribute in furs from Indigenous peoples. By mid-century, Russian outposts had reached the Pacific.",
            cite: "Written for this site",
          },
          questions: [
            { q: "Russian expansion described in the passage is best understood as an example of",
              options: ["land-based imperial expansion driven partly by valuable natural resources", "maritime trading-post empire building", "decolonization in Central Asia", "the spread of industrial capitalism"],
              why: "Russia expanded overland, motivated in part by the profitable fur trade." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "In the 1630s, the Tokugawa shogunate banned Christianity, forbade Japanese from traveling abroad, and restricted European trade to a small Dutch post at Nagasaki.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The policies described in the passage were most likely a response to",
              options: ["concerns that foreign influence and Christianity threatened political stability", "a lack of interest in trade among European merchants", "Japan's defeat by the Ming navy", "the decline of the samurai class"],
              why: "The shogunate saw Christianity and foreign ties as threats to its control after a long period of civil war." },
          ],
        },
      ],
    },
    {
      num: 21, title: "Revolutionary Changes in the Atlantic World", dates: "1750–1850", unit: 5,
      sets: [
        {
          source: {
            kind: "Primary source",
            text: "“Article 1. Men are born and remain free and equal in rights. Social distinctions may be founded only upon the general good. … Article 3. The principle of all sovereignty resides essentially in the nation. No body nor individual may exercise any authority which does not proceed directly from the nation.”",
            cite: "Declaration of the Rights of Man and of the Citizen, adopted by France's National Assembly, 1789",
          },
          questions: [
            { q: "The ideas in the declaration most directly reflect the influence of",
              options: ["Enlightenment thinkers such as Locke and Rousseau", "the divine right of kings", "Confucian ideas of hierarchy", "mercantilist economic theory"],
              why: "Natural rights and popular sovereignty were core Enlightenment ideas." },
            { q: "Ideas like those in the declaration were most directly used by which group in the French colony of Saint-Domingue?",
              options: ["Enslaved people and free people of color seeking equality and an end to slavery", "Spanish officials seeking to expand their empire", "British merchants seeking control of sugar exports", "French planters seeking to strengthen slavery"],
              why: "The Haitian Revolution drew on revolutionary ideals of liberty and equality to end slavery and French rule." },
            { q: "Which of the following best describes a limitation of the declaration?",
              options: ["It did not extend full political rights to women, as critics such as Olympe de Gouges noted", "It restored absolute power to the French king", "It applied only to the French clergy", "It banned all forms of private property"],
              why: "Olympe de Gouges answered with the Declaration of the Rights of Woman (1791), highlighting women's exclusion." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "In Spanish America, people of European descent born in the colonies resented that the highest offices went to officials born in Spain. When Napoleon invaded Spain in 1808, many seized the opportunity to form their own governments.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The group described in the passage is best identified as",
              options: ["creoles, who led most Latin American independence movements", "peninsulares, who sought to strengthen Spanish rule", "mestizos, who led the Haitian Revolution", "Indigenous peoples allied with Napoleon"],
              why: "Creoles like Simón Bolívar led independence movements against Spanish rule." },
          ],
        },
      ],
    },
    {
      num: 22, title: "The Early Industrial Revolution", dates: "1760–1851", unit: 5,
      sets: [
        {
          source: {
            kind: "Primary source",
            text: "“It is not from the benevolence of the butcher, the brewer, or the baker, that we expect our dinner, but from their regard to their own interest.”",
            cite: "Adam Smith, Scottish economist, The Wealth of Nations, 1776",
          },
          questions: [
            { q: "Smith's argument most directly supports which economic approach?",
              options: ["Free markets in which individuals pursue their own interest with limited government interference", "State ownership of all major industries", "Strict government regulation of prices and wages", "Communal ownership of land and factories"],
              why: "Smith argued self-interest in competitive markets benefits society, the basis of laissez-faire capitalism." },
            { q: "Smith's ideas were most directly a challenge to which of the following?",
              options: ["Mercantilism", "Socialism", "Social Darwinism", "Neoliberalism"],
              why: "Smith criticized mercantilist trade restrictions and monopolies." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "In the early textile mills of northern England, men, women, and children worked twelve or more hours a day near dangerous machinery. Investigations by Parliament in the 1830s documented these conditions.",
            cite: "Written for this site",
          },
          questions: [
            { q: "Which of the following was a response to the conditions described in the passage?",
              options: ["The formation of labor unions and laws limiting child labor", "The return of production to the domestic system", "The abolition of factories in Britain", "Government seizure of all private industry"],
              why: "Workers organized unions, and reforms such as the Factory Act of 1833 limited child labor." },
            { q: "Which of the following best explains why industrialization began in Britain?",
              options: ["Britain had coal and iron deposits, available capital, and access to colonial markets", "Britain had the largest population in the world", "Britain banned agricultural improvement", "Britain lacked colonies and needed to produce everything at home"],
              why: "Natural resources, capital, rivers, a labor supply from agricultural change, and imperial markets combined to give Britain an early lead." },
          ],
        },
      ],
    },
    {
      num: 23, title: "Nation Building and Economic Transformation in the Americas", dates: "1800–1890", unit: 6,
      sets: [
        {
          source: {
            kind: "Practice passage",
            text: "After independence, many Latin American economies relied on exporting raw materials—beef and wheat from Argentina, guano and nitrates from Peru and Chile, coffee from Brazil. British investors financed many of the railroads and ports that moved these goods.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The pattern described in the passage is best understood as an example of",
              options: ["economic imperialism, as foreign investment shaped export-based economies", "rapid industrialization led by Latin American governments", "a return to Spanish mercantilism", "Latin American control of British industry"],
              why: "Even independent states could become economically dependent on foreign capital and raw-material exports." },
            { q: "Which of the following best explains why many immigrants moved to Argentina in the late 1800s?",
              options: ["Labor demand in an expanding export economy", "Forced deportations by the Spanish crown", "The discovery of oil in Patagonia", "Religious persecution by the Argentine government"],
              why: "Expanding agriculture and ranching attracted millions of European migrants, especially from Italy and Spain." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "Brazil abolished slavery in 1888, making it the last country in the Americas to do so. The following year, its monarchy was overthrown and a republic was declared.",
            cite: "Written for this site",
          },
          questions: [
            { q: "Brazil's abolition of slavery is best understood in the context of",
              options: ["a broader nineteenth-century movement to end slavery and the slave trade", "the beginning of the Atlantic slave trade", "the Columbian Exchange", "Cold War competition"],
              why: "Abolition spread through the 1800s, driven by enslaved resistance, activists, and changing economics." },
          ],
        },
      ],
    },
    {
      num: 24, title: "Land Empires in the Age of Imperialism", dates: "1800–1870", unit: 5,
      sets: [
        {
          source: {
            kind: "Practice passage",
            text: "Between 1839 and 1876, Ottoman officials reorganized the army, opened new schools, adopted legal codes modeled partly on European law, and declared all subjects equal before the law regardless of religion.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The reforms described in the passage are known as",
              options: ["the Tanzimat", "the Self-Strengthening Movement", "the Meiji Restoration", "the New Economic Policy"],
              why: "The Tanzimat reforms aimed to modernize and strengthen the Ottoman state." },
            { q: "The reforms described were most likely intended to",
              options: ["strengthen the empire against European pressure and internal nationalism", "abolish the Ottoman sultanate", "reestablish the devshirme system", "convert all Ottoman subjects to Islam"],
              why: "Ottoman leaders hoped reform would preserve the empire against outside powers and separatist movements." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "British merchants, who bought large amounts of Chinese tea, began shipping opium grown in India into China. When Qing officials destroyed opium stocks at Canton in 1839, Britain responded with war.",
            cite: "Written for this site",
          },
          questions: [
            { q: "British merchants' actions described in the passage were primarily motivated by",
              options: ["a desire to reverse a trade imbalance that drained silver to China", "a wish to support Qing anti-drug laws", "British efforts to protect Indian sovereignty", "a lack of demand for Chinese goods in Britain"],
              why: "Opium sales let Britain pay for tea without sending silver." },
            { q: "Which of the following was a result of the conflict described in the passage?",
              options: ["China was forced to cede Hong Kong and open ports to foreign trade", "China gained control of British India", "Britain banned the opium trade", "The Qing dynasty collapsed immediately"],
              why: "The Treaty of Nanjing (1842) began a series of unequal treaties." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "In 1861, Tsar Alexander II freed Russia's serfs. Former serfs, however, often had to make redemption payments for land, and many remained poor.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The reform described in the passage is best understood as an attempt to",
              options: ["modernize Russia after its defeat in the Crimean War", "restore Mongol rule over Russia", "establish a communist government", "expand serfdom into Siberia"],
              why: "Defeat in the Crimean War exposed Russia's backwardness, prompting reforms including emancipation." },
          ],
        },
      ],
    },
    {
      num: 25, title: "Africa, India, and the New British Empire", dates: "1750–1870", unit: 6,
      sets: [
        {
          source: {
            kind: "Practice passage",
            text: "In 1857, Indian soldiers in the East India Company's army rebelled, angered in part by rumors that new rifle cartridges were greased with cow and pig fat. The revolt spread across northern India before it was suppressed.",
            cite: "Written for this site",
          },
          questions: [
            { q: "Which of the following was the most direct result of the rebellion described?",
              options: ["The British government took direct control of India from the East India Company", "India gained independence from Britain", "Britain withdrew from South Asia", "The Mughal Empire expanded its power"],
              why: "In 1858 the Crown dissolved Company rule and established the British Raj." },
            { q: "The rebellion described is best understood as an example of",
              options: ["resistance to colonial rule rooted in religious and cultural grievances", "a Cold War proxy conflict", "a peasant revolt against Mughal taxes", "a nationalist movement inspired by Marxism"],
              why: "The sepoys' grievances combined religious concerns with broader resentment of British policies." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "After Britain abolished the slave trade in 1807, West African rulers and merchants increasingly exported palm oil, which British factories used to make soap and lubricate machines.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The shift described in the passage best illustrates",
              options: ["how industrialization in Europe reshaped African economies toward raw-material exports", "the end of all trade between Africa and Europe", "the industrialization of West Africa", "the expansion of the Atlantic slave trade"],
              why: "Industrial demand created new 'legitimate trade' in raw materials, tying African economies to European industry." },
          ],
        },
      ],
    },
    {
      num: 26, title: "The New Power Balance", dates: "1850–1900", unit: 5,
      sets: [
        {
          source: {
            kind: "Primary source",
            text: "“The history of all hitherto existing society is the history of class struggles.”",
            cite: "Karl Marx and Friedrich Engels, The Communist Manifesto, 1848",
          },
          questions: [
            { q: "The ideas expressed in the excerpt were most directly a response to",
              options: ["the social inequalities of industrial capitalism", "the decline of the Mughal Empire", "the Columbian Exchange", "the spread of absolutism in Russia"],
              why: "Marx and Engels argued that industrial capitalism exploited workers (the proletariat)." },
            { q: "Ideas like those in the excerpt most directly influenced which later development?",
              options: ["The Bolshevik Revolution in Russia in 1917", "The Meiji Restoration in Japan", "The Protestant Reformation", "The Berlin Conference"],
              why: "Lenin and the Bolsheviks drew on Marxist ideas to seize power in 1917." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "After 1868, Japan's new leaders sent officials abroad to study Western governments and industries, built railroads and state-funded factories, created a conscript army, and adopted a constitution in 1889.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The reforms described in the passage are best understood as",
              options: ["state-sponsored modernization to strengthen Japan against Western powers", "a rejection of all foreign influences", "a peasant revolution against the emperor", "a policy imposed by a colonial government"],
              why: "Meiji leaders selectively adopted Western models to build a modern, industrial state." },
            { q: "Which of the following was a result of the reforms described in the passage?",
              options: ["Japan became an imperial power, defeating China (1895) and Russia (1905)", "Japan was colonized by Britain", "Japan abolished its army", "Japan returned to Tokugawa isolation"],
              why: "Industrial and military strength let Japan build its own empire in East Asia." },
          ],
        },
      ],
    },
    {
      num: 27, title: "The New Imperialism", dates: "1869–1914", unit: 6,
      sets: [
        {
          source: {
            kind: "Primary source",
            text: "“Take up the White Man's burden— / Send forth the best ye breed— / Go bind your sons to exile / To serve your captives' need”",
            cite: "Rudyard Kipling, British writer, “The White Man's Burden,” 1899",
          },
          questions: [
            { q: "The poem most directly reflects which of the following?",
              options: ["The belief that Western powers had a duty to 'civilize' colonized peoples", "Opposition to all forms of imperialism", "Support for the independence of colonized peoples", "Marxist criticism of capitalism"],
              why: "The poem expresses the 'civilizing mission' idea used to justify imperialism." },
            { q: "Ideas like those in the poem were often supported by which of the following?",
              options: ["Social Darwinism", "Liberation theology", "The Non-Aligned Movement", "Neo-Confucianism"],
              why: "Social Darwinism claimed racial hierarchies that imperialists used to justify conquest." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "Steamships carried troops up African rivers, quinine protected Europeans from malaria, and rapid-fire guns gave small colonial forces a large advantage in battle.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The passage best explains which of the following?",
              options: ["How industrial technology made rapid European conquest of Africa possible", "Why Europeans avoided Africa until the twentieth century", "How African states industrialized", "Why the Atlantic slave trade expanded"],
              why: "Industrial-era tools—steam, medicine, and weapons—enabled the Scramble for Africa." },
            { q: "Which of the following was an exception to the pattern suggested by the passage?",
              options: ["Ethiopia's defeat of Italy at the Battle of Adwa in 1896", "Britain's conquest of the Zulu kingdom", "France's conquest of Algeria", "Belgium's control of the Congo"],
              why: "Ethiopia, under Menelik II, used modern weapons to defeat Italy and stay independent." },
          ],
        },
      ],
    },
    {
      num: 28, title: "The Crisis of the Imperial Order", dates: "1900–1929", unit: 7,
      sets: [
        {
          source: {
            kind: "Primary source",
            text: "“The Allied and Associated Governments affirm and Germany accepts the responsibility of Germany and her allies for causing all the loss and damage to which the Allied and Associated Governments and their nationals have been subjected as a consequence of the war.”",
            cite: "Treaty of Versailles, Article 231, 1919",
          },
          questions: [
            { q: "The article most directly contributed to which of the following?",
              options: ["German resentment that extremist movements, including the Nazis, later exploited", "Germany's acquisition of new colonies", "The immediate creation of the United Nations", "A lasting alliance between Germany and France"],
              why: "The 'war guilt' clause and reparations fueled anger in Germany." },
            { q: "Which of the following was another outcome of the peace settlement after the First World War?",
              options: ["Former Ottoman territories were placed under British and French mandates", "All European colonies became independent", "The Ottoman Empire expanded into the Balkans", "Russia joined the Allies in signing the treaty"],
              why: "The mandate system gave Britain and France control of territories such as Iraq, Syria, and Palestine." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "During the First World War, governments rationed food, used propaganda posters, conscripted millions of men, recruited soldiers and laborers from their colonies, and hired women for factory work.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The developments described in the passage are best understood as examples of",
              options: ["total war", "appeasement", "containment", "laissez-faire policy"],
              why: "Total war mobilized entire societies, economies, and empires for the war effort." },
          ],
        },
      ],
    },
    {
      num: 29, title: "The Collapse of the Old Order", dates: "1929–1949", unit: 7,
      sets: [
        {
          source: {
            kind: "Practice passage",
            text: "After 1928, the Soviet government set production targets for coal, steel, and machinery and forced peasants onto collective farms. Industrial output rose sharply, but resistance to collectivization was crushed and famine killed millions.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The policies described in the passage are best known as",
              options: ["Stalin's Five-Year Plans", "Lenin's New Economic Policy", "Gorbachev's perestroika", "the Marshall Plan"],
              why: "Stalin's Five-Year Plans emphasized rapid heavy industrialization and collectivized agriculture." },
            { q: "The policies described differed from the U.S. New Deal in that they",
              options: ["relied on total state control of the economy rather than government intervention in a market economy", "relied entirely on private enterprise", "reduced government involvement in the economy", "were designed to respond to the Great Depression in the United States"],
              why: "The New Deal used government spending within capitalism; Soviet planning abolished private markets." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "In 1931, Japan's army seized Manchuria, a region rich in coal and iron. In 1937, Japan launched a full-scale invasion of China, and its forces committed mass atrocities in the city of Nanjing.",
            cite: "Written for this site",
          },
          questions: [
            { q: "Japanese expansion described in the passage was most directly motivated by",
              options: ["a desire for raw materials and markets during the Great Depression", "a desire to spread communism in Asia", "the requirements of the Treaty of Versailles", "an alliance with the Soviet Union"],
              why: "Japan, lacking natural resources and hit by the Depression, sought an empire in Asia." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "After Japan's defeat in 1945, China's Nationalist government and the Communist Party resumed their civil war. In 1949, Mao Zedong proclaimed the People's Republic of China, and the Nationalists retreated to Taiwan.",
            cite: "Written for this site",
          },
          questions: [
            { q: "Which of the following best explains the Communists' victory described in the passage?",
              options: ["Their support among peasants, built partly through land reform and resistance to Japan", "Military aid from the United States", "The support of China's urban business class", "An alliance with the Nationalist government"],
              why: "Mao's focus on the peasantry and the Communists' reputation for fighting Japan won broad support." },
          ],
        },
      ],
    },
    {
      num: 30, title: "Striving for Independence: India, Africa, and Latin America", dates: "1900–1949", unit: 8,
      sets: [
        {
          source: {
            kind: "Primary source",
            text: "“At the stroke of the midnight hour, when the world sleeps, India will awake to life and freedom.”",
            cite: "Jawaharlal Nehru, speech to India's Constituent Assembly, August 14, 1947",
          },
          questions: [
            { q: "The independence celebrated in the speech was achieved largely through",
              options: ["mass nonviolent resistance and negotiation, led by figures such as Gandhi", "a long armed revolution against Britain", "intervention by the Soviet Union", "a military coup by the Indian army"],
              why: "The Indian National Congress used civil disobedience (e.g., the Salt March) and negotiation." },
            { q: "Which of the following accompanied the independence described in the speech?",
              options: ["The partition of British India into India and Pakistan, causing mass migration and violence", "The unification of all of South Asia under one government", "Britain's annexation of Pakistan", "The restoration of the Mughal Empire"],
              why: "Partition displaced millions and caused communal violence between Hindus, Muslims, and Sikhs." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "In 1938, Mexican president Lázaro Cárdenas nationalized foreign-owned oil companies and created a state oil company. Many Mexicans celebrated the act as a victory for national sovereignty.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The action described in the passage best reflects which of the following?",
              options: ["Economic nationalism aimed at reducing foreign control over resources", "The adoption of free-market neoliberal policies", "Mexico's alignment with the Axis powers", "A return to Spanish colonial rule"],
              why: "Nationalizing foreign assets asserted control over natural resources, a common goal in the twentieth century." },
          ],
        },
      ],
    },
    {
      num: 31, title: "The Cold War and Decolonization", dates: "1945–1975", unit: 8,
      sets: [
        {
          source: {
            kind: "Primary source",
            text: "“I believe that it must be the policy of the United States to support free peoples who are resisting attempted subjugation by armed minorities or by outside pressures.”",
            cite: "President Harry Truman, address to Congress, 1947",
          },
          questions: [
            { q: "The policy expressed in the excerpt is best described as",
              options: ["containment of communism", "isolationism", "appeasement", "the Non-Aligned Movement"],
              why: "The Truman Doctrine committed the U.S. to resist communist expansion." },
            { q: "Which of the following was a direct application of the policy in the excerpt?",
              options: ["U.S. intervention in the Korean War", "The Bolshevik Revolution", "The Berlin Conference", "The partition of India"],
              why: "The U.S. fought in Korea to stop the spread of communism." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "In 1955, leaders from twenty-nine Asian and African countries met at Bandung, Indonesia, to promote economic cooperation and oppose colonialism. Leaders such as Nehru, Sukarno, and Nasser later helped form a movement to avoid joining either superpower bloc.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The movement described in the passage was primarily intended to",
              options: ["allow newly independent states to remain independent of both the U.S. and the USSR", "join NATO as a unified bloc", "restore European colonial rule", "spread Soviet communism"],
              why: "The Non-Aligned Movement sought independence from Cold War alignments." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "Ghana won independence from Britain in 1957 after strikes and campaigns led by Kwame Nkrumah. Algeria, by contrast, won independence from France in 1962 only after an eight-year war.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The passage best illustrates which of the following?",
              options: ["Decolonization occurred through both negotiation and armed struggle", "All African colonies became independent through war", "Britain and France supported immediate independence for all colonies", "African independence movements were directed by the Soviet Union"],
              why: "Paths to independence varied, often depending on the presence of settlers and the colonizer's response." },
          ],
        },
      ],
    },
    {
      num: 32, title: "Crisis, Realignment, and the Dawn of the Post–Cold War World", dates: "1975–1991", unit: 9,
      sets: [
        {
          source: {
            kind: "Practice passage",
            text: "After 1978, Deng Xiaoping allowed peasants to sell surplus crops at market prices, created Special Economic Zones open to foreign investment, and encouraged private enterprise—while the Communist Party kept tight political control.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The reforms described in the passage are best understood as",
              options: ["introducing market-based economics while maintaining one-party rule", "a return to Maoist collectivization", "a transition to multi-party democracy", "an attempt to isolate China from world trade"],
              why: "Deng's reforms combined markets and foreign investment with Communist political control." },
            { q: "Which of the following was a result of the reforms described?",
              options: ["Rapid economic growth and China's increasing integration into the global economy", "Famine caused by collectivized agriculture", "China's withdrawal from the United Nations", "The collapse of the Communist Party in 1991"],
              why: "China became one of the world's fastest-growing economies and a major exporter." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "In the late 1980s, Mikhail Gorbachev allowed open criticism of the government and introduced limited market reforms. Within a few years, Eastern European states abandoned communism and, in 1991, the Soviet Union dissolved.",
            cite: "Written for this site",
          },
          questions: [
            { q: "Gorbachev's policies described in the passage are known as",
              options: ["glasnost and perestroika", "collectivization and Five-Year Plans", "containment and détente", "the Tanzimat"],
              why: "Glasnost (openness) and perestroika (restructuring) aimed to revive the Soviet system." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "In 1979, a revolution in Iran overthrew the U.S.-backed shah and established an Islamic republic led by Ayatollah Khomeini.",
            cite: "Written for this site",
          },
          questions: [
            { q: "The revolution described in the passage best illustrates",
              options: ["the rise of religious movements challenging secular, Western-aligned governments", "the spread of Soviet communism in the Middle East", "the success of the Non-Aligned Movement", "the decline of nationalism in the Middle East"],
              why: "The Iranian Revolution was a major example of political Islam opposing a secular, Western-backed regime." },
          ],
        },
      ],
    },
    {
      num: 33, title: "Globalization in the New Millennium", dates: "since 1991", unit: 9,
      sets: [
        {
          source: {
            kind: "Primary source",
            text: "“All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards each other in a spirit of brotherhood.”",
            cite: "Universal Declaration of Human Rights, Article 1, adopted by the United Nations, 1948",
          },
          questions: [
            { q: "The declaration most directly reflects which of the following?",
              options: ["Efforts to create international standards of human rights after the Second World War", "The goals of the Treaty of Versailles", "The spread of Social Darwinism", "Cold War containment policy"],
              why: "After WWII atrocities, the UN sought universal rights standards." },
            { q: "Later movements that drew on ideas like those in the declaration include",
              options: ["campaigns against apartheid in South Africa", "the Scramble for Africa", "the Great Leap Forward", "Japanese expansion in Manchuria"],
              why: "Anti-apartheid activists and many rights movements appealed to universal human rights." },
          ],
        },
        {
          source: {
            kind: "Practice passage",
            text: "Container shipping, the internet, and agreements reducing tariffs have allowed companies to move production across borders. Supporters credit these changes with lifting millions out of poverty; critics point to lost manufacturing jobs, environmental damage, and inequality.",
            cite: "Written for this site",
          },
          questions: [
            { q: "Which of the following organizations most directly promoted the changes in trade described?",
              options: ["The World Trade Organization", "The League of Nations", "The Warsaw Pact", "The Non-Aligned Movement"],
              why: "The WTO (1995) set rules for reducing trade barriers." },
            { q: "The critics described in the passage are most similar to which of the following?",
              options: ["Protesters at the 1999 WTO meeting in Seattle", "Supporters of the Marshall Plan", "Leaders of the Meiji Restoration", "Advocates of mercantilism in the 1600s"],
              why: "The Seattle protests were a visible example of resistance to economic globalization." },
          ],
        },
      ],
    },
  ],
};

// Compact format used by the js/book/*.js files:
// TEXTBOOK.add(chapterNum, [
//   [kind, sourceText, cite, [stem, correct, wrong1, wrong2, wrong3, explanation], ...more questions],
// ]);
// kind: "P" practice passage written for this site, "Q" quoted primary source, "S" secondary-source summary.
TEXTBOOK.add = function (num, sets) {
  const ch = TEXTBOOK.chapters.find((c) => c.num === num);
  const KINDS = { P: "Practice passage", Q: "Primary source", S: "Historical interpretation" };
  sets.forEach(([kind, text, cite, ...qs]) => {
    ch.sets.push({
      source: { kind: KINDS[kind], text, cite: cite || "Written for this site" },
      questions: qs.map(([q, a, b, c, d, why]) => ({ q, options: [a, b, c, d], why })),
    });
  });
};

// Chapter vocabulary for flashcards: TEXTBOOK.vocab(chapterNum, [[term, definition], ...]).
// Definitions are written for this site, not copied from the textbook's glossary.
TEXTBOOK.vocab = function (num, cards) {
  const ch = TEXTBOOK.chapters.find((c) => c.num === num);
  ch.vocab = (ch.vocab || []).concat(cards.map(([term, def]) => ({ term, def })));
};
