package com.gestionloyer.controller;

import com.gestionloyer.model.Lot;
import com.gestionloyer.service.LotService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lots")
@CrossOrigin(origins = "*")
public class LotController {

    private final LotService lotService;

    public LotController(LotService lotService) {
        this.lotService = lotService;
    }

    @GetMapping
    public List<Lot> lister(@RequestParam(required = false) Long foyerId) {
        if (foyerId != null) {
            return lotService.listerParFoyer(foyerId);
        }
        return lotService.lister();
    }

    @GetMapping("/libres")
    public List<Lot> libres() {
        return lotService.listerLibres();
    }

    @PostMapping
    public Lot creer(@RequestBody Map<String, Object> payload) {
        Long foyerId = resolveLong(payload, "idFoyer", "foyerId");
        if (foyerId == null) {
            throw new RuntimeException("Le foyer est obligatoire");
        }

        Lot lot = new Lot();
        lot.setNumero(resolveString(payload, "numero", "reference", "referenceLot", "codeLot"));
        lot.setTypeLot(resolveString(payload, "typeLot", "type"));
        lot.setSurface(resolveDouble(payload, "surface", "superficie"));
        lot.setLoyerBase(resolveDouble(payload, "loyerBase", "loyer", "loyerMensuel"));
        lot.setCaution(resolveDouble(payload, "caution"));
        lot.setStatut(resolveString(payload, "statut", "status", "etat"));
        lot.setDescription(resolveString(payload, "description", "details"));
        lot.setNombrePieces(resolveInteger(payload, "nombrePieces", "pieces"));
        lot.setEtage(resolveInteger(payload, "etage", "etageLot"));

        if (lot.getNumero() == null || lot.getNumero().isBlank()) {
            lot.setNumero("LOT-" + System.currentTimeMillis());
        }
        if (lot.getTypeLot() == null || lot.getTypeLot().isBlank()) {
            lot.setTypeLot("Appartement");
        }
        if (lot.getStatut() == null || lot.getStatut().isBlank()) {
            lot.setStatut("LIBRE");
        }

        return lotService.ajouter(lot, foyerId);
    }

    @PutMapping("/{id}")
    public Lot modifier(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Lot lot = new Lot();
        lot.setNumero(resolveString(payload, "numero", "reference", "referenceLot", "codeLot"));
        lot.setTypeLot(resolveString(payload, "typeLot", "type"));
        lot.setSurface(resolveDouble(payload, "surface", "superficie"));
        lot.setLoyerBase(resolveDouble(payload, "loyerBase", "loyer", "loyerMensuel"));
        lot.setCaution(resolveDouble(payload, "caution"));
        lot.setStatut(resolveString(payload, "statut", "status", "etat"));
        lot.setDescription(resolveString(payload, "description", "details"));
        lot.setNombrePieces(resolveInteger(payload, "nombrePieces", "pieces"));
        lot.setEtage(resolveInteger(payload, "etage", "etageLot"));

        return lotService.modifier(id, lot);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        lotService.supprimer(id);
    }

    private Long resolveLong(Map<String, Object> payload, String... keys) {
        for (String key : keys) {
            if (payload.containsKey(key) && payload.get(key) != null) {
                try {
                    return Long.valueOf(payload.get(key).toString());
                } catch (NumberFormatException ignored) {
                }
            }
        }
        return null;
    }

    private String resolveString(Map<String, Object> payload, String... keys) {
        for (String key : keys) {
            if (payload.containsKey(key) && payload.get(key) != null) {
                return String.valueOf(payload.get(key));
            }
        }
        return null;
    }

    private Double resolveDouble(Map<String, Object> payload, String... keys) {
        for (String key : keys) {
            if (payload.containsKey(key) && payload.get(key) != null) {
                try {
                    return Double.valueOf(payload.get(key).toString());
                } catch (NumberFormatException ignored) {
                }
            }
        }
        return 0.0;
    }

    private Integer resolveInteger(Map<String, Object> payload, String... keys) {
        for (String key : keys) {
            if (payload.containsKey(key) && payload.get(key) != null) {
                try {
                    return Integer.valueOf(payload.get(key).toString());
                } catch (NumberFormatException ignored) {
                }
            }
        }
        return 0;
    }
}
