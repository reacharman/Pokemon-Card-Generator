const TYPE_COLORS = {
    bug: "#26de81",
    dragon: "#ffeaa7",
    electric: "#fed330",
    fairy: "#FF0069",
    fighting: "#30336b",
    fire: "#f0932b",
    flying: "#81ecec",
    grass: "#00b894",
    ground: "#EFB549",
    ghost: "#a55eea",
    ice: "#74b9ff",
    normal: "#95afc0",
    poison: "#6c5ce7",
    psychic: "#a29bfe",
    rock: "#2d3436",
    water: "#0190FF",
};

class PokemonCardGenerator {
    constructor() {
        this.API_URL = "https://pokeapi.co/api/v2/pokemon/";
        this.card = document.getElementById("card");
        this.generateBtn = document.getElementById("generateBtn");
        this.loadingEl = document.getElementById("loading");
        this.errorEl = document.getElementById("error");
        
        this.bindEvents();
        this.initializeParticles();
    }

    initializeParticles() {
        const background = document.querySelector('.background-animation');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.setProperty('--x', `${Math.random() * 100}%`);
            particle.style.setProperty('--y', `${Math.random() * 100}%`);
            particle.style.setProperty('--duration', `${Math.random() * 20 + 10}s`);
            particle.style.setProperty('--delay', `${Math.random() * 5}s`);
            background.appendChild(particle);
        }
    }

    bindEvents() {
        this.generateBtn.addEventListener("click", () => this.generatePokemon());
        window.addEventListener("load", () => this.generatePokemon());
    }

    async generatePokemon() {
        try {
            this.showLoading();
            const id = Math.floor(Math.random() * 150) + 1;
            const response = await fetch(this.API_URL + id);
            
            if (!response.ok) {
                throw new Error('Failed to fetch Pokemon data');
            }

            const data = await response.json();
            await this.generateCard(data);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    async generateCard(data) {
        const {
            stats: [
                { base_stat: hp },
                { base_stat: attack },
                { base_stat: defense },
                ,
                ,
                { base_stat: speed }
            ],
            sprites: { other: { dream_world: { front_default: image } } },
            name,
            types
        } = data;

        const pokeName = name.charAt(0).toUpperCase() + name.slice(1);
        const themeColor = TYPE_COLORS[types[0].type.name];

        this.card.innerHTML = `
            <p class="hp">
                <span>HP </span>${hp}
            </p>
            <img src="${image}" alt="${pokeName}" onerror="this.src='https://via.placeholder.com/180x180?text=Pokemon'"/>
            <h2 class="poke-name">${pokeName}</h2>
            <div class="types"></div>
            <div class="stats">
                <div>
                    <h3>${attack}</h3>
                    <p>Attack</p>
                </div>
                <div>
                    <h3>${defense}</h3>
                    <p>Defense</p>
                </div>
                <div>
                    <h3>${speed}</h3>
                    <p>Speed</p>
                </div>
            </div>
        `;

        await this.appendTypes(types, themeColor);
        this.styleCard(themeColor);
        this.addCardAnimation();
    }

    async appendTypes(types, themeColor) {
        const typesContainer = this.card.querySelector(".types");
        types.forEach(({ type: { name } }) => {
            const span = document.createElement("span");
            span.textContent = name;
            span.style.backgroundColor = TYPE_COLORS[name] || themeColor;
            typesContainer.appendChild(span);
        });
    }

    styleCard(color) {
        this.card.style.background = `linear-gradient(145deg, rgba(26, 26, 46, 0.9), rgba(26, 26, 46, 0.6))`;
        document.querySelector('.card-glow').style.setProperty('--glow-color', color + '80');
    }

    addCardAnimation() {
        this.card.style.opacity = '0';
        this.card.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            this.card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            this.card.style.opacity = '1';
            this.card.style.transform = 'translateY(0)';
        });
    }

    showLoading() {
        this.loadingEl.style.display = "block";
        this.errorEl.style.display = "none";
        this.generateBtn.disabled = true;
        this.card.style.opacity = '0.5';
    }

    hideLoading() {
        this.loadingEl.style.display = "none";
        this.generateBtn.disabled = false;
        this.card.style.opacity = '1';
    }

    showError(message) {
        this.errorEl.textContent = message;
        this.errorEl.style.display = "block";
        this.card.innerHTML = '';
        this.card.style.opacity = '1';
    }
}

// Add event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Pokemon Card Generator
    new PokemonCardGenerator();

    // Add mousemove event for card tilt effect
    const card = document.querySelector('.card');
    if (card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }
});

// Optional: Add keyboard support for generating new Pokemon
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        const generator = document.getElementById('generateBtn');
        if (generator && !generator.disabled) {
            generator.click();
        }
    }
});