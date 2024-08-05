var ntn = [
        { eng: 'kakad arati bhupali', hin: 'काकड आरती-भूपाळी', dir: 'ntn', id: '6.1', bk: 'नाना तिरीचा नामरंग', pg: '6' },
        { eng: 'kakad arati shri datta prabodh stav', hin: 'काकड आरती-श्री दत्त प्रभोधस्तव' , dir: 'ntn', id: '6.2' , bk: 'नाना तिरीचा नामरंग', pg: '6' },
        { eng: 'kakad arati aarati arti jay deva shri sadguru dnyan', hin: 'काकड आरती-जय देवा श्री सद्गुरु जय ज्ञान रुपा',  dir: 'ntn', id: '8' , bk: 'नाना तिरीचा नामरंग', pg: '8' },
        { eng: 'kakad arati shri dattatreya prarthan chashk', hin: 'काकड आरती-श्री दत्तात्रेय प्रार्थना चतुष्क', dir: 'ntn', id: '9', bk: 'नाना तिरीचा नामरंग', pg: '9' },
        { eng: 'kakad arati manas atm puja pooja', hin: 'काकड आरती-श्री मानस पूजा (श्री आत्मपूजा)', dir: 'ntn', id: '10', bk: 'नाना तिरीचा नामरंग', pg: '10' }, 
        { eng: 'prabhati jago mohan pyare', hin: 'प्रभाती-जागो मोहन प्यारे', dir: 'ntn', id: '13', bk: 'नाना तिरीचा नामरंग', pg: '13' }, 
        { eng: 'prabhati jagiye raghunath kunvar kuvar', hin: 'प्रभाती-जागिये रघुनाथ कुँवर', dir: 'ntn', id: '13.2', bk: 'नाना तिरीचा नामरंग', pg: '13' }, 
        { eng: 'prabhati uth pandharichya raya', hin: 'प्रभाती-उठ पंढरीच्या राया', dir: 'ntn', id: '14', bk: 'नाना तिरीचा नामरंग', pg: '14' }, 
        { eng: 'prabhati uthi ba shri guruvara', hin: 'प्रभाती-उठी उठी बा श्री गुरुवरा मार्तंडा', dir: 'ntn', id: '14.2', bk: 'नाना तिरीचा नामरंग', pg: '14' }, 
        { eng: 'prabhati guruji me main to ek', hin: 'प्रभाती-गुरुजी मै तो एक निरंजन', dir: 'ntn', id: '15', bk: 'नाना तिरीचा नामरंग', pg: '15' }, 
        { eng: 'prabhati bheti lage maze', hin: 'प्रभाती-भेटी लागी माझे', dir: 'ntn', id: '16', bk: 'नाना तिरीचा नामरंग', pg: '16' }, 
        { eng: 'prabhati jag prabho', hin: 'प्रभाती-जाग जाग जाग प्रभो', dir: 'ntn', id: '16.2', bk: 'नाना तिरीचा नामरंग', pg: '16' }, 
        { eng: 'aukshan karuya samayi suswagata', hin: 'करुया समयी सुस्वागता', dir: 'ntn', id: '18', bk: 'नाना तिरीचा नामरंग', pg: '18' }, 
        { eng: 'acharani sadgurucha', hin: 'आचरणी सद्गुरुच्या', dir: 'ntn', id: '18.2', bk: 'नाना तिरीचा नामरंग', pg: '18' }, 
        { eng: 'prapanchi din deen jan aamhi', hin: 'प्रपंची दीन जन आम्ही', dir: 'ntn', id: '19', bk: 'नाना तिरीचा नामरंग', pg: '19' }, 
        { eng: 'nana aale ale', hin: 'नाना आले नाना आले', dir: 'ntn', id: '20', bk: 'नाना तिरीचा नामरंग', pg: '20' }, 
        { eng: 'ek guru ahe aahe', hin: 'एक गुरु आहे', dir: 'ntn', id: '20.2', bk: 'नाना तिरीचा नामरंग', pg: '20' }, 
        { eng: 'deh karm bahy ho', hin: 'देह कर्म बाह्य हो', dir: 'ntn', id: '21', bk: 'नाना तिरीचा नामरंग', pg: '21' },  
        { eng: 'guru bhajanacha deva mala rang lago', hin: 'गुरु भजनाचा देवा मला रंग लागो', dir: 'ntn', id: '21.2', bk: 'नाना तिरीचा नामरंग', pg: '21' },  
        { eng: 'alankapuri punya bhumi pavitra', hin: 'अलंकापुरी पुण्य भुमी पवित्र', dir: 'ntn', id: '23', bk: 'नाना तिरीचा नामरंग', pg: '23' }, 
        { eng: 'rup pahata lochani', hin: 'रुप पाहता लोचनी', dir: 'ntn', id: '23.2', bk: 'नाना तिरीचा नामरंग', pg: '23' }, 
        { eng: 'sadguru yave yaave', hin: 'सद्गुरु यावे', dir: 'ntn', id: '24', bk: 'नाना तिरीचा नामरंग', pg: '24' }, 
        { eng: 'bhimatiri ek basavile nagar', hin: 'भीमातीरी एक बसविले नगर', dir: 'ntn', id: '25', bk: 'नाना तिरीचा नामरंग', pg: '25' }, 
        { eng: 'manuja ram bhajava', hin: 'मनुजा राम भजावा रे ', dir: 'ntn', id: '26', bk: 'नाना तिरीचा नामरंग', pg: '26' }, 
        { eng: 'lagala chataka', hin: 'लागला चटका', dir: 'ntn', id: '26.2', bk: 'नाना तिरीचा नामरंग', pg: '26' }, 
        { eng: 'ekade basavili pandhari', hin: 'इकडे बसविली पंढरी', dir: 'ntn', id: '27', bk: 'नाना तिरीचा नामरंग', pg: '27' }, 
        { eng: 'kuni nahi kunacha sakha', hin: 'कुणी नाही कुणाचा सखा', dir: 'ntn', id: '28', bk: 'नाना तिरीचा नामरंग', pg: '28' }, 
        { eng: 'hanumant mahabali', hin: 'हनुमंत महाबळी', dir: 'ntn', id: '29', bk: 'नाना तिरीचा नामरंग', pg: '29' }, 
        { eng: 'pandurang shrirang bhajare mana', hin: 'पांडुरंग श्रीरंग, भजरे मना', dir: 'ntn', id: '29.2', bk: 'नाना तिरीचा नामरंग', pg: '29' }, 
        { eng: 'bhaj nara satat', hin: 'भज नरा सतत', dir: 'ntn', id: '30', bk: 'नाना तिरीचा नामरंग', pg: '30' },          
        { eng: 'ek don tin char', hin: 'एक दोन तीन चार', dir: 'ntn', id: '30.2', bk: 'नाना तिरीचा नामरंग', pg: '30' },          
        { eng: 'kshir sagarichya pundya', hin: 'क्षीर सागरीच्या पुण्ड्या', dir: 'ntn', id: '31', bk: 'नाना तिरीचा नामरंग', pg: '31' },          
        { eng: 'adhi hota vaghya', hin: 'आधी होता वाघ्या', dir: 'ntn', id: '31.2', bk: 'नाना तिरीचा नामरंग', pg: '31' },          
        { eng: 'bramhan to ek narahari sonar', hin: 'ब्राह्मण तो एक नरहरि सोनार', dir: 'ntn', id: '32', bk: 'नाना तिरीचा नामरंग', pg: '32' },          
        { eng: 'kanhobachi sangati', hin: 'कान्होबाची संगती', dir: 'ntn', id: '33', bk: 'नाना तिरीचा नामरंग', pg: '33' },          
        { eng: 'nachat jau tychya gava re kheliya', hin: 'नाचत जाऊ त्याच्या गावा रे खेळिया', dir: 'ntn', id: '33.2', bk: 'नाना तिरीचा नामरंग', pg: '33' },          
     
     
    ];

if (typeof module === 'object' && module.exports) {
    module.exports = ntn;
}
