const GQL_ENDPOINT = 'https://countries.trevorblades.com/graphql';
const GET_COUNTRIES_QUERY = `
  query CountriesQuery {
    countries {
      name
      emoji
      continent {
        name
      }
      languages {
        name
      }
    }
  }
`;

async function getAllCountries() {
  try {
    const response = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: GET_COUNTRIES_QUERY }),
    });
    const countries = await response.json();

    return countries.data.countries;
  } catch (err) {
    console.error(err);
  }
}

const countriesCardContainer = document.querySelector('#countries-card-container');

async function renderCountries() {
  const countries = await getAllCountries();
  const cards = [];

  for (let i = 0; i < 30; i++) {
    cards.push(cardComponent(countries[i]));
  }

  countriesCardContainer.innerHTML = cards.join('');
}

function cardComponent(data) {
  return `
    <div class="rounded-xl bg-zinc-800/30 px-8 py-6">
      <h1 class="text-xl">${data.emoji} ${data.name}</h1>
      <span class="mt-4 inline-block ${getContinentColor(
        data.continent.name
      )} px-3 py-1 rounded-full text-sm">${data.continent.name}</span>
    </div>
  `;
}

function getContinentColor(continent) {
  switch (continent) {
    case 'Africa':
      return 'bg-emerald-600/20 text-emerald-600';
      break;
    case 'Antarctica':
      return 'bg-sky-500/20 text-sky-600';
      break;
    case 'Asia':
      return 'bg-red-700/20 text-red-700';
      break;
    case 'Europe':
      return 'bg-blue-600/20 text-blue-600';
      break;
    case 'North America':
      return 'bg-slate-600/20 text-slate-600';
      break;
    case 'Oceania':
      return 'bg-teal-600/20 text-teal-600';
      break;
    case 'South America':
      return 'bg-yellow-700/20 text-yellow-700';
      break;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCountries();
  // getAllCountries();
});
