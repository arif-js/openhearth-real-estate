/// <reference types="leaflet.markercluster" />
"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import { AirtableProperty } from "@/types/airtable";

interface PropertyMapProps {
    properties: AirtableProperty[];
}

function makePinIcon() {
    // Crisp, modern pin marker (SVG). No external assets.
    const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path d="M20 2C11.7 2 5 8.7 5 17c0 11.7 15 33 15 33s15-21.3 15-33C35 8.7 28.3 2 20 2z" fill="#2563eb"/>
        <circle cx="20" cy="17" r="6.5" fill="#ffffff" opacity="0.95"/>
      </g>
    </svg>
  `);

    return L.icon({
        iconUrl: `data:image/svg+xml,${svg}`,
        iconSize: [34, 44],
        iconAnchor: [17, 44],
        popupAnchor: [0, -40],
    });
}

export default function PropertyMap({ properties }: PropertyMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    const markerLayerRef = useRef<L.MarkerClusterGroup | null>(null);

    const pinIcon = useMemo(() => makePinIcon(), []);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        // Create map
        const map = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: true,
            preferCanvas: true, // smoother performance for many markers
        }).setView([34.0736, -118.4004], 11);

        mapInstance.current = map;

        // Pro basemap (Carto Voyager)
        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
            {
                subdomains: "abcd",
                maxZoom: 20,
            }
        ).addTo(map);

        // Controls (top-right looks more “app”)
        L.control
            .zoom({ position: "topright" })
            .addTo(map);

        L.control
            .attribution({ position: "bottomright" })
            .addTo(map)
            .addAttribution(
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            );

        // Cluster group for professional handling of many points
        const clusterGroup = L.markerClusterGroup({
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            disableClusteringAtZoom: 16,
            maxClusterRadius: 44,
        });

        markerLayerRef.current = clusterGroup;
        map.addLayer(clusterGroup);

        return () => {
            map.remove();
            mapInstance.current = null;
            markerLayerRef.current = null;
        };
    }, [pinIcon]);

    useEffect(() => {
        const map = mapInstance.current;
        const cluster = markerLayerRef.current;
        if (!map || !cluster) return;

        // Clear old markers
        cluster.clearLayers();

        const bounds = L.latLngBounds([]);
        let hasPoints = false;

        for (const property of properties) {
            if (!property.Latitude || !property.Longitude) continue;

            const title = property.Title ?? "Untitled";
            const price =
                typeof property.Price === "number"
                    ? `$${property.Price.toLocaleString()}`
                    : "";

            const popupHtml = `
        <div style="min-width: 180px; font-family: ui-sans-serif, system-ui;">
          <div style="display:flex; flex-direction:column; gap:6px;">
            <div style="font-size:14px; font-weight:700; color:#0f172a; line-height:1.2;">
              ${escapeHtml(title)}
            </div>
            ${price
                    ? `<div style="font-size:12px; font-weight:600; color:#334155;">${price}</div>`
                    : ""
                }
            <a href="/properties/${property.Record_ID}"
               style="display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:#2563eb; text-decoration:none;">
              View details
              <span style="font-size:14px;">→</span>
            </a>
          </div>
        </div>
      `;

            const marker = L.marker([property.Latitude, property.Longitude], {
                icon: pinIcon,
                riseOnHover: true,
            }).bindPopup(popupHtml, {
                closeButton: true,
                maxWidth: 260,
                className: "dlz-popup", // hook for styling below
            });

            cluster.addLayer(marker);
            bounds.extend([property.Latitude, property.Longitude]);
            hasPoints = true;
        }

        if (hasPoints) {
            map.fitBounds(bounds, { padding: [60, 60] });
        }
    }, [properties, pinIcon]);

    return (
        <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div ref={mapRef} className="w-full h-full" />

            {/* Optional subtle top gradient for “app polish” */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/45 to-transparent" />

            {/* Leaflet popup polish */}
            <style jsx global>{`
        .leaflet-container {
          background: #f8fafc;
        }
        .dlz-popup .leaflet-popup-content-wrapper {
          border-radius: 14px;
        }
        .dlz-popup .leaflet-popup-tip {
        }
        .leaflet-control-zoom a {
          border-radius: 12px !important;
        }
        .leaflet-touch .leaflet-control-layers, .leaflet-touch .leaflet-bar {
          border: none !important;
        }
        .leaflet-control-zoom-in span {
          position: relative;
          top: -3px !important;
        }
        .leaflet-control-zoom-out span {
          position: relative;
          top: -1px !important;
        }
      `}</style>
        </div>
    );
}

function escapeHtml(input: string) {
    return input
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
