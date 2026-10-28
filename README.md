<div align="center">
  <h1> 𝓖𝓪𝔃𝓲 𝓜. 𝓚𝓮𝓶𝓪𝓵 </h1>
</div>

# loriel-web-sentinel

A zero-cost Uptime and SSL monitoring solution powered by GitHub Actions. 
It checks predefined client websites and fails the CI/CD pipeline if a site goes down or SSL expires, automatically triggering a GitHub email alert to the repository owner.

## TR

Müşteri projelerinin (veya kendi sitelerinizin) çöküp çökmediğini ve SSL sertifikalarının durumunu kontrol eden, GitHub Actions üzerinde çalışan sıfır maliyetli bir SecOps otomasyonu. Eğer bir site çökerse süreç başarısız olur ve GitHub size anında ücretsiz e-posta uyarısı gönderir.

## Architecture & SecOps
- **No External Database:** Uses a local `sites.json` file to manage targets.
- **No Server Costs:** Runs on a scheduled GitHub Actions cron job.
- **Zero Dependencies:** Core logic built entirely with the native Node.js `https` module to eliminate supply chain attack risks.