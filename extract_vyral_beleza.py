import asyncio
import csv
import json
import re
from pathlib import Path

URL = "https://app.vyral.com.br/feed/beleza-e-cuidados-pessoais/1"
CSV_PATH = Path("beleza_cuidados_pessoais_vyral.csv")
JSON_PATH = Path("beleza_cuidados_pessoais_vyral.json")
LOG_PATH = Path("beleza_cuidados_pessoais_vyral.log")


def extract_video_id(url):
    match = re.search(r"tiktok-video%2F([^%]+)%2F", url or "")
    return match.group(1) if match else "Não encontrado"


def tiktok_video_url(username, video_id):
    if username == "Não encontrado" or video_id == "Não encontrado":
        return "Não encontrado"
    return f"https://www.tiktok.com/@{username}/video/{video_id}"


def tiktok_creator_url(username):
    if username == "Não encontrado":
        return "Não encontrado"
    return f"https://www.tiktok.com/@{username}"


async def main():
    logs = []

    try:
        from playwright.async_api import async_playwright
    except Exception as exc:
        message = (
            "ERRO: o pacote Python 'playwright' não está instalado neste ambiente. "
            f"Detalhe: {exc}"
        )
        LOG_PATH.write_text(message + "\n", encoding="utf-8")
        print(message)
        raise SystemExit(1)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page(viewport={"width": 1440, "height": 1200})
        logs.append(f"Abrindo URL: {URL}")
        await page.goto(URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(5000)

        for _ in range(4):
            cards = await page.locator("img[alt='Video Thumbnail']").count()
            logs.append(f"Cards com thumbnail encontrados até agora: {cards}")
            if cards >= 10:
                break
            await page.mouse.wheel(0, 900)
            await page.wait_for_timeout(1200)

        snapshot_texts = await page.locator("body").inner_text()
        image_items = []
        image_count = await page.locator("img").count()
        for index in range(image_count):
            img = page.locator("img").nth(index)
            src = await img.get_attribute("src")
            alt = await img.get_attribute("alt")
            image_items.append({"index": index, "src": src or "", "alt": alt or ""})

        lines = [line.strip() for line in snapshot_texts.splitlines() if line.strip()]
        records = []
        rank_indexes = [i for i, line in enumerate(lines) if re.fullmatch(r"#\d+", line)]
        logs.append(f"Rankings detectados no texto: {len(rank_indexes)}")

        for pos, start in enumerate(rank_indexes[:10]):
            end = rank_indexes[pos + 1] if pos + 1 < len(rank_indexes) else len(lines)
            block = lines[start:end]

            ranking = block[0].replace("#", "") if block else "Não encontrado"
            titulo = block[1] if len(block) > 1 else "Não encontrado"
            descricao = block[2] if len(block) > 2 else "Não encontrado"
            creator = block[3] if len(block) > 3 else "Não encontrado"

            metrics = [item for item in block if re.search(r"^\d+([.,]\d+)?[KM]?$|^R\$", item, re.I)]
            visualizacoes = metrics[0] if len(metrics) > 0 else "Não encontrado"
            curtidas = metrics[1] if len(metrics) > 1 else "Não encontrado"
            vendas = metrics[2] if len(metrics) > 2 else "Não encontrado"
            gmv = next((item for item in block if item.startswith("R$")), "Não encontrado")

            image_base = 2 + pos * 3
            thumbnail_url = image_items[image_base]["src"] if image_base < len(image_items) else "Não encontrado"
            produto_imagem_url = image_items[image_base + 1]["src"] if image_base + 1 < len(image_items) else "Não encontrado"
            avatar_url = image_items[image_base + 2]["src"] if image_base + 2 < len(image_items) else "Não encontrado"
            video_id = extract_video_id(thumbnail_url)

            records.append(
                {
                    "ranking": ranking,
                    "thumbnail_imagem_principal": thumbnail_url or "Não encontrado",
                    "titulo_video_produto": titulo,
                    "categoria": "Beleza e Cuidados Pessoais",
                    "nome_criador": creator,
                    "username_criador": creator,
                    "visualizacoes": visualizacoes,
                    "curtidas": curtidas,
                    "comentarios": "Não encontrado",
                    "vendas_quantidade_vendida": vendas,
                    "faturamento_gmv": gmv,
                    "botao_transcricao": "Transcrição" if "Transcrição" in block else "Não encontrado",
                    "link_video": tiktok_video_url(creator, video_id),
                    "link_produto": "Não encontrado",
                    "descricao_video": descricao,
                    "video_id": video_id,
                    "produto_imagem_url": produto_imagem_url or "Não encontrado",
                    "avatar_criador_url": avatar_url or "Não encontrado",
                    "link_criador": tiktok_creator_url(creator),
                    "dados_relevantes_card": " | ".join(block),
                }
            )

        await browser.close()

    fields = list(records[0].keys()) if records else []
    with CSV_PATH.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fields)
        writer.writeheader()
        writer.writerows(records)

    JSON_PATH.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    logs.extend(
        [
            f"Cards extraídos: {len(records)}",
            f"Campos coletados: {', '.join(fields)}",
            f"CSV salvo em: {CSV_PATH.resolve()}",
            f"JSON salvo em: {JSON_PATH.resolve()}",
        ]
    )
    LOG_PATH.write_text("\n".join(logs) + "\n", encoding="utf-8")
    print("\n".join(logs))


if __name__ == "__main__":
    asyncio.run(main())
