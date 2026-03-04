import React, { useRef, useEffect, useState } from 'react';
import { GameProps } from './types';
import { ChevronLeft, CheckCircle } from 'lucide-react';

interface ExternalGameWrapperProps extends GameProps {
    url: string;
    chapterId?: number;
}

export function ExternalGameWrapper({ url, onComplete, onExit, chapterId }: ExternalGameWrapperProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const outerRef = useRef<HTMLDivElement>(null);

    /*
     * Measure the ACTUAL container element (not window).
     * On desktop: PhoneFrame screen = 375×812px → stays inside the phone UI.
     * On Android: full-screen WebView → fills the device screen.
     * ResizeObserver re-measures whenever the container changes size.
     */
    const [dims, setDims] = useState({ w: 375, h: 812 });

    useEffect(() => {
        const measure = () => {
            if (outerRef.current) {
                const r = outerRef.current.getBoundingClientRect();
                setDims({ w: Math.round(r.width), h: Math.round(r.height) });
            }
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (outerRef.current) ro.observe(outerRef.current);
        return () => ro.disconnect();
    }, []);

    /*
     * LANDSCAPE-IN-PORTRAIT inside the container:
     *   landscapeW = container height  (e.g. 812 on desktop / ~844 on device)
     *   landscapeH = container width   (e.g. 375 on desktop / ~390 on device)
     *
     * The inner div is sized landscapeW × landscapeH, centred, then rotated
     * −90° so it fills the container in landscape orientation.
     * Buttons float as semi-transparent pills over the game — no bars means
     * the game gets the full landscapeW × landscapeH space: no cropping.
     */
    const landscapeW = dims.h;
    const landscapeH = dims.w;

    return (
        /*
         * Outer: position:absolute fills the ChaptersScreen overlay div
         * exactly — it is clipped by PhoneFrame's overflow:hidden so it
         * never escapes the phone frame on desktop.
         */
        <div
            ref={outerRef}
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                backgroundColor: '#000',
            }}
        >
            {/* Inner rotated landscape container */}
            <div
                style={{
                    position: 'absolute',
                    width: landscapeW,
                    height: landscapeH,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-90deg)',
                    transformOrigin: 'center center',
                    overflow: 'hidden',
                    backgroundColor: '#000',
                }}
            >
                {/* ── GAME IFRAME — 100% of landscape space ── */}
                <iframe
                    ref={iframeRef}
                    src={url}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        backgroundColor: '#000',
                    }}
                    allow="autoplay; fullscreen; keyboard; gamepad"
                    title="Game"
                />

                {/* ── FLOATING "MAP" button — top-left ── */}
                <button
                    onTouchStart={(e) => {
                        e.stopPropagation();
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.opacity = '1';
                        b.style.transform = 'scale(0.90)';
                    }}
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.opacity = '0.82';
                        b.style.transform = 'scale(1)';
                        onExit?.();
                    }}
                    onClick={(e) => { e.stopPropagation(); onExit?.(); }}
                    style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 200,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '7px 14px',
                        background: 'rgba(10,16,30,0.82)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: 999,
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 11,
                        letterSpacing: '0.09em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        minHeight: 40,
                        opacity: 0.82,
                        transition: 'transform 0.08s, opacity 0.08s',
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.55)',
                    }}
                >
                    <ChevronLeft style={{ width: 16, height: 16, flexShrink: 0 }} />
                    Map
                </button>

                {/* ── MOBILE CONTROLS (Chapter 6 Bridge) ── */}
                {chapterId === 6 && (
                    <>
                        <div style={{
                            position: 'absolute',
                            bottom: 20,
                            left: 20,
                            zIndex: 300,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 10,
                            pointerEvents: 'auto'
                        }}>
                            <div />
                            <ControlButton
                                icon="⬆️"
                                keyCode={38} // Up
                                iframeRef={iframeRef}
                            />
                            <div />
                            <ControlButton
                                icon="⬅️"
                                keyCode={37} // Left
                                iframeRef={iframeRef}
                            />
                            <div />
                            <ControlButton
                                icon="➡️"
                                keyCode={39} // Right
                                iframeRef={iframeRef}
                            />
                            <div />
                            <ControlButton
                                icon="⬇️"
                                keyCode={40} // Down
                                iframeRef={iframeRef}
                            />
                            <div />
                        </div>

                        <div style={{
                            position: 'absolute',
                            bottom: 20,
                            right: 80,
                            zIndex: 300,
                            display: 'flex',
                            gap: 15,
                            pointerEvents: 'auto'
                        }}>
                            <ControlButton
                                icon="SPACE"
                                keyCode={32} // Space
                                iframeRef={iframeRef}
                                wide
                            />
                            <ControlButton
                                icon="⚔️"
                                keyCode={90} // 'Z' - Common attack/Select
                                isClick={true} // Also trigger mouse click
                                iframeRef={iframeRef}
                            />
                        </div>
                    </>
                )}

                {/* ── FLOATING "CLAIM" button — bottom-right ── */}
                <button
                    onTouchStart={(e) => {
                        e.stopPropagation();
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.opacity = '1';
                        b.style.transform = 'scale(0.93)';
                    }}
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.opacity = '0.88';
                        b.style.transform = 'scale(1)';
                        onComplete?.(600, 3);
                    }}
                    onClick={(e) => { e.stopPropagation(); onComplete?.(600, 3); }}
                    style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        zIndex: 400,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '7px 14px',
                        background: 'rgba(22,163,74,0.88)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.20)',
                        borderRadius: 999,
                        color: '#fff',
                        fontWeight: 900,
                        fontSize: 11,
                        letterSpacing: '0.09em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        minHeight: 40,
                        opacity: 0.88,
                        transition: 'transform 0.08s, opacity 0.08s',
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.55)',
                    }}
                >
                    <CheckCircle style={{ width: 15, height: 15, flexShrink: 0 }} />
                    Claim
                </button>
            </div>
        </div>
    );
}

// Internal Helper for Mobile Controls
function ControlButton({ icon, keyCode, iframeRef, wide = false, isClick = false }: { icon: string, keyCode: number, iframeRef: React.RefObject<HTMLIFrameElement>, wide?: boolean, isClick?: boolean }) {
    const dispatchKey = (type: 'keydown' | 'keyup') => {
        if (!iframeRef.current?.contentWindow) return;
        try {
            // Dispatch keyboard event
            const event = new KeyboardEvent(type, {
                keyCode: keyCode,
                which: keyCode,
                key: keyCode === 32 ? ' ' : undefined,
                bubbles: true,
                cancelable: true
            });
            iframeRef.current.contentWindow.dispatchEvent(event);
            iframeRef.current.contentWindow.document.dispatchEvent(event);

            // If it's the attack button, also try to trigger a mouse click for older GameMaker versions
            if (isClick && type === 'keydown') {
                const mouseEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: iframeRef.current.contentWindow,
                    button: 0
                });
                iframeRef.current.contentWindow.dispatchEvent(mouseEvent);
                iframeRef.current.contentWindow.document.dispatchEvent(mouseEvent);
            } else if (isClick && type === 'keyup') {
                const mouseEvent = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: iframeRef.current.contentWindow,
                    button: 0
                });
                iframeRef.current.contentWindow.dispatchEvent(mouseEvent);
                iframeRef.current.contentWindow.document.dispatchEvent(mouseEvent);
            }
        } catch (e) {
            console.warn("Touch bridge restricted by cross-origin policy. Local mirroring will fix this.");
        }
    };

    return (
        <button
            onTouchStart={(e) => { e.preventDefault(); dispatchKey('keydown'); }}
            onTouchEnd={(e) => { e.preventDefault(); dispatchKey('keyup'); }}
            onMouseDown={(e) => { e.preventDefault(); dispatchKey('keydown'); }}
            onMouseUp={(e) => { e.preventDefault(); dispatchKey('keyup'); }}
            style={{
                width: wide ? 80 : 50,
                height: 50,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 12,
                color: 'white',
                fontWeight: 'bold',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none'
            }}
        >
            {icon}
        </button>
    );
}
