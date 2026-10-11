

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- MOBILE MENU ----------

const menuButton = document.querySelector(".mobile-menu");
const nav = document.querySelector(".main-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- ACTIVE NAV LINK ----------

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".main-nav a")];

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id === "final-access" ? "ctf" : entry.target.id}`
          );
        });
      });
    },
    {
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// ---------- MODULES UITKLAPPEN ----------

const modulesToggle = document.querySelector(".modules-toggle");
const modulesList = document.querySelector(".modules-list");

if (modulesToggle && modulesList) {
  modulesToggle.addEventListener("click", () => {
    const isHidden = modulesList.hasAttribute("hidden");

    if (isHidden) {
      modulesList.removeAttribute("hidden");
    } else {
      modulesList.setAttribute("hidden", "");
    }

    modulesToggle.setAttribute("aria-expanded", String(isHidden));

    const arrow = modulesToggle.querySelector("span");
    if (arrow) arrow.textContent = isHidden ? "▼" : "▶";
  });
}

// ---------- RUSTIGE PARTICLES ----------

const canvas = document.getElementById("particles");

if (canvas && !reduceMotion) {
  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];

  const config = {
    // Bewust weinig particles zodat de website rustig blijft.
    desktopCount: 34,
    mobileCount: 20,

    // Zeer lage snelheid.
    speed: 0.075,

    // Alleen dicht bij elkaar een subtiele lijn.
    connectionDistance: 105,

    // Lage zichtbaarheid.
    connectionOpacity: 0.045
  };

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
  }

  function createParticles() {
    const count = width < 700 ? config.mobileCount : config.desktopCount;

    particles = Array.from({ length: count }, (_, index) => {
      const isPurple = index % 5 === 0;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 0.9 + 0.45,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        rgb: isPurple ? "139, 92, 246" : "19, 221, 255",
        alpha: Math.random() * 0.28 + 0.14
      };
    });
  }

  function moveParticle(particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -8) particle.x = width + 8;
    if (particle.x > width + 8) particle.x = -8;
    if (particle.y < -8) particle.y = height + 8;
    if (particle.y > height + 8) particle.y = -8;
  }

  function drawParticle(particle) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${particle.rgb}, ${particle.alpha})`;
    ctx.fill();
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.connectionDistance) {
          const strength =
            (1 - distance / config.connectionDistance) *
            config.connectionOpacity;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(70, 166, 255, ${strength})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      moveParticle(particle);
      drawParticle(particle);
    });

    drawConnections();

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  animate();
}

const flagForm = document.getElementById("flag-form");

if (flagForm) {
  const flagAnswers = {
    "ROOTV3X{hidden_in_plain_sight}":
      "✓ Eerste flag gevonden! Codefragment 1/4: NOVA",

    "ROOTV3X{terminal_access_granted}":
      "✓ Terminal secret opgelost! Codefragment 2/4: 2048",

    "ROOTV3X{base64_is_not_encryption}":
      "✓ Decode me opgelost! Codefragment 3/4: ECHO",

    "ROOTV3X{follow_the_trail}":
      "✓ Follow the trail opgelost! Codefragment 4/4: 7713"
  };

  flagForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const answer = document.getElementById("flag-input").value.trim();
    const result = document.getElementById("flag-result");

    if (Object.hasOwn(flagAnswers, answer)) {
      result.textContent = flagAnswers[answer];
    } else {
      result.textContent =
        "Nog niet goed. Onderzoek de broncode, terminal en write-ups.";
    }
  });
}

const terminalForm = document.getElementById("terminal-form");

if (terminalForm) {
  const input = document.getElementById("terminal-input");
  const history = document.getElementById("terminal-history");

  const files = {
  "readme.txt":
    "Welkom bij het RootV3x-lab.\n" +
    "Elke missie begint met een briefing.\n" +
    "Er is ook een onderschept bericht: transmission.txt\n" +
    "Een nieuw spoor wacht in trail.txt.",

  "mission.txt":
    "Mission briefing unlocked.\n" +
    "Flag: ROOTV3X{terminal_access_granted}",

  "transmission.txt":
    "[ INTERCEPTED TRANSMISSION ]\n\n" +
    "Uk9PVFYzWHtiYXNlNjRfaXNfbm90X2VuY3J5cHRpb259\n\n" +
    "Hint: 64 tekens vormen mijn alfabet.\n" +
    "Ik verberg de leesbaarheid, maar ben geen versleuteling.",
   
  "trail.txt":
    "Drie machines. Eén bestemming.\n\n" +
    "Volg deze volgorde: Jerry → Cap → MetaTwo.\n" +
    "Elke write-up bewaart een fragment in de broncode.\n" +
    "Plak de fragmenten aan elkaar en voeg .html toe.\n" +
    "De bestemming staat naast de homepage."
  };

  function printLine(text) {
    const line = document.createElement("p");
    line.textContent = text;
    history.appendChild(line);

    // Houd de terminalgeschiedenis beperkt.
    while (history.children.length > 80) {
      history.firstElementChild.remove();
    }

    history.scrollTop = history.scrollHeight;
  }

  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const command = input.value.trim();
    input.value = "";

    if (!command) return;

    printLine("$ " + command);

    const [action, ...args] = command.split(/\s+/);

    switch (action.toLowerCase()) {
      case "help":
        printLine(
          "Beschikbare opdrachten:\n" +
          "help          Toon deze hulp\n" +
          "ls            Bekijk bestanden\n" +
          "cat <bestand> Lees een bestand\n" +
          "whoami        Wie ben je?\n" +
          "clear         Wis de terminalgeschiedenis"
        );
        break;

      case "ls":
        printLine(Object.keys(files).join("\n"));
        break;

      case "cat": {
        const filename = args.join(" ");

        if (Object.hasOwn(files, filename)) {
          printLine(files[filename]);
        } else {
          printLine("Bestand niet gevonden. Gebruik ls.");
        }
        break;
      }

      case "whoami":
        printLine("guest@rootv3x — nieuwsgierigheid is je toegangssleutel");
        break;

      case "clear":
        history.replaceChildren();
        break;

      default:
        printLine("Onbekende opdracht. Typ help.");
    }

    input.focus();
  });
}

const finalForm = document.getElementById("final-form");

if (finalForm) {
  finalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(finalForm);

    const code = ["part1", "part2", "part3", "part4"]
      .map((name) => String(data.get(name) ?? "").trim().toUpperCase())
      .join("-");

    const result = document.getElementById("final-result");
    const status = document.getElementById("vault-status");

    if (code === "NOVA-2048-ECHO-7713") {
      status.textContent = "MISSION COMPLETE";
      status.classList.add("mission-complete");

      result.classList.add("final-victory");

      result.innerHTML = `
        <span class="victory-badge">ACCESS GRANTED</span>
        <strong class="victory-title">CTF COMPLETED</strong>
        <span class="victory-message">
          Je hebt alle vijf puzzels opgelost.
          De laatste flag is van jou.
        </span>
        <code class="victory-flag">ROOTV3X{curiosity_unlocks_everything}</code>
        <span class="victory-signoff">
          Hack · Learn · Build · Improve
        </span>
     `;
  finalForm.hidden = true;
} else {
      result.textContent =
        "Access denied. Controleer je vier fragmenten en hun volgorde.";
    }
  });
}