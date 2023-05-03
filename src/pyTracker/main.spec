# -*- mode: python ; coding: utf-8 -*-


block_cipher = None
runtime_data_folder = 'videoProcessing'
added_files = [
         ( 'src/videoProcessing/fsanet_capsule_3_16_2_21_5.h5', runtime_data_folder ),
         ( 'src/videoProcessing/res10_300x300_SSD_iter_140000.caffemodel', runtime_data_folder ),
         ( 'src/videoProcessing/shape_predictor_5_face_landmarks.dat', runtime_data_folder), 
         ( 'src/videoProcessing/deploy.prototxt.txt', runtime_data_folder)
         ]

a = Analysis(
    ['src/main.py'],
    pathex=[],
    binaries=[],
    datas=added_files,
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

splash = Splash('src/assets/bu.png',
                binaries=a.binaries,
                datas=a.datas,
                text_pos=(35, 50),
                text_size=15,
                text_color='blue')

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    splash,
    splash.binaries,   
    [],
    name='main',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
app = BUNDLE(
    exe,
    name='main.app',
    icon=None,
    bundle_identifier=None,
)
