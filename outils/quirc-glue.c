/* Lecteur QR quirc compilé en WebAssembly pour Break Protocol (sans bibliothèque C) */
#include <stddef.h>
#include <stdint.h>
#include "quirc.h"
extern unsigned char __heap_base;
static size_t sommet = 0;
void *malloc(size_t n) {
  if (!sommet) sommet = (size_t)&__heap_base;
  n = (n + 15) & ~(size_t)15;
  size_t debut = sommet, fin = debut + n, taille = __builtin_wasm_memory_size(0) * 65536;
  if (fin > taille) { size_t pages = (fin - taille + 65535) / 65536; if (__builtin_wasm_memory_grow(0, pages) == (size_t)-1) return 0; }
  sommet = fin; return (void *)debut;
}
void free(void *p) { (void)p; }
void *memset(void *d, int c, size_t n) { unsigned char *p = d; while (n--) *p++ = (unsigned char)c; return d; }
void *memcpy(void *d, const void *s, size_t n) { unsigned char *a = d; const unsigned char *b = s; while (n--) *a++ = *b++; return d; }
void *memmove(void *d, const void *s, size_t n) { unsigned char *a = d; const unsigned char *b = s; if (a < b) while (n--) *a++ = *b++; else { a += n; b += n; while (n--) *--a = *--b; } return d; }
void *calloc(size_t a, size_t b) { void *p = malloc(a * b); if (p) memset(p, 0, a * b); return p; }
void *realloc(void *p, size_t n) { void *q = malloc(n); if (p && q) memcpy(q, p, n); return q; }

static char resultat[1024];
struct quirc *qr_creer(int w, int h) { struct quirc *q = quirc_new(); if (!q || quirc_resize(q, w, h) < 0) return 0; return q; }
uint8_t *qr_tampon(struct quirc *q) { return quirc_begin(q, 0, 0); }
char *qr_resultat(void) { return resultat; }
/* Accentue l'image (masque flou) : aide pour les cartes un peu floues */
void qr_accentuer(uint8_t *img, int w, int h, uint8_t *tmp) {
  /* flou boîte 5x5 séparable dans tmp, puis img = img + 0.9*(img - flou) */
  for (int y = 0; y < h; y++) { int s = 0; uint8_t *l = img + y * w, *o = tmp + y * w;
    for (int x = -2; x <= 2; x++) s += l[x < 0 ? 0 : x];
    for (int x = 0; x < w; x++) { o[x] = s / 5; int a = x - 2 < 0 ? 0 : x - 2, b = x + 3 >= w ? w - 1 : x + 3; s += l[b] - l[a]; } }
  for (int x = 0; x < w; x++) { int s = 0;
    for (int y = -2; y <= 2; y++) s += tmp[(y < 0 ? 0 : y) * w + x];
    for (int y = 0; y < h; y++) { int f = s / 5, v = img[y * w + x], r = v + (v - f) * 9 / 10; img[y * w + x] = r < 0 ? 0 : r > 255 ? 255 : r;
      int a = y - 2 < 0 ? 0 : y - 2, b = y + 3 >= h ? h - 1 : y + 3; s += tmp[b * w + x] - tmp[a * w + x]; } }
}
/* Analyse l'image du tampon : renvoie la longueur du texte lu, 0 = aucun QR vu, -1 = un QR vu mais illisible */
int qr_lire(struct quirc *q) {
  quirc_end(q);
  int n = quirc_count(q);
  for (int i = 0; i < n; i++) {
    struct quirc_code c; struct quirc_data d;
    quirc_extract(q, i, &c);
    quirc_decode_error_t e = quirc_decode(&c, &d);
    if (e == QUIRC_ERROR_DATA_ECC) { quirc_flip(&c); e = quirc_decode(&c, &d); }
    if (!e && d.payload_len > 0 && d.payload_len < (int)sizeof(resultat)) { memcpy(resultat, d.payload, d.payload_len); resultat[d.payload_len] = 0; return d.payload_len; }
  }
  return n > 0 ? -1 : 0;
}
