
const getData = async () => {
    const res = await fetch('./task.xml');
    return await res.text();
};

function getInfo () {
    getData()
        .then(xml => {
            const xmlContent = xml;

            const parser = new DOMParser(),
                  xmlDom = parser.parseFromString(xmlContent, 'application/xml'),
                  characters = xmlDom.querySelectorAll('character'),
                  comics = xmlDom.querySelectorAll('comic');

            let arr = [];

            characters.forEach((hero) => {
                const skills = hero.querySelectorAll('skill');

                let generalLevel = 0,
                    mainSkillLevel = 0,
                    mainSkillName = '',
                    countSkills = 0,
                    countComics = 0,
                    comicsWithHero = [],
                    rating = {};

                skills.forEach((skill) => {
                    generalLevel += parseFloat(skill.getAttribute('level'));

                    if (skill.getAttribute('main')) {
                        mainSkillLevel = parseFloat(skill.getAttribute('level'));
                        mainSkillName = skill.getAttribute('name');
                    }

                    countSkills++;
                });

                comics.forEach(comic => {
                    const heroes = comic.getAttribute('heroes'),
                          title = comic.getAttribute('name');
                    
                    
                    if (heroes.match(hero.getAttribute('name'))) {
                        comicsWithHero.push(title);
                        countComics++;
                    }
                });

                rating['name'] = hero.getAttribute('name');
                rating['numberOfSkills'] = countSkills;
                rating['sumLevels'] = +generalLevel.toFixed(2);
                rating['mainSkillName'] = mainSkillName;
                rating['mainSkillLevel'] = mainSkillLevel;
                rating['numberOfComics'] = countComics;
                rating['titleOfComics'] = comicsWithHero;

                arr.push(rating);
            });

            arr.sort((a, b) => {
            return (a.sumLevels < b.sumLevels) - (b.sumLevels < a.sumLevels) || (a.mainSkill < b.mainSkill) - (b.mainSkill < a.mainSkill);
            });
            heroPlaces(arr);
            showInfo(arr);
        });
}
    
function heroPlaces(arr) {
    const container = document.createElement('div'),
          listHeroes = document.createElement('ol');
    listHeroes.classList.add('list');
    
    arr.forEach(hero => {
        const place = document.createElement('li'),
              img = document.createElement('img');
        
        place.classList.add('list__item');
        img.src = `images/${hero.name}.png`;
        place.append(img);
        listHeroes.append(place);
    });

    document.body.append(container);
    container.append(listHeroes);
}

function showInfo (arr) {
    const images = document.querySelectorAll('img'),
          info = document.createElement('div');

    info.classList.add('info');

    images.forEach(img => {
        img.addEventListener('click', () => {
            arr.forEach(hero => {
                if (img.getAttribute('src').match(hero.name)) {
                    info.innerHTML = `
                    <p>
                        ??????: ${hero.name} <br>
                        ???????????????????? ????????????: ${hero.numberOfSkills} <br>
                        ?????????? ?????????????? ???????? ??????????????: ${hero.sumLevels} <br>
                        ???????????????? ??????????: ${hero.mainSkillName} <br>
                        ???????????????????? ???????????????? ?? ????????????: ${hero.numberOfComics} <br>
                        ???????????????? ????????????????: ${hero.titleOfComics} 
                    </p>
                    `;
                }
            });
        });
        document.body.append(info);
    });
}

getInfo();


