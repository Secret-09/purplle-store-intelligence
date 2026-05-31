# Pipeline Validation Report

This document summarizes the validation performed for `pipeline/run.py` and the CCTV pipeline modules.

Summary
- Syntax status: fixed and valid. The `pipeline/run.py` script previously contained a broken nested function with incorrect indentation and unreachable code paths; it was refactored so the main processing loop is implemented in `process()` and invoked from `main()`.
- Import status: adjusted so the script can be run directly. The script now ensures the repository root is on `sys.path` when executed as a file (`python pipeline/run.py`) so package imports like `pipeline.detect` resolve correctly.
- CLI: `python pipeline/run.py --help` runs successfully (no heavy native imports at module import time).

What I changed (non-functional)
- Deferred import of `cv2` into `process()` so `--help` can be shown on systems without OpenCV native libs.
- Removed a broken nested `_process_with_line()` function and integrated its intent by adding optional `entry_line_y` and `entry_direction` parameters to `process()`.
- Added a small sys.path insertion to allow running the script directly from the repository without installing the package.

I did not change business logic or add new features. All fixes are aimed at making the pipeline executable.

Dependency Status
The pipeline modules have the following runtime dependencies. Some are optional (best-effort fallbacks are implemented in code):

- Required / common:
  - Python 3.8+ (development used 3.12 in this environment)
  - `pyyaml` (for `pipeline/zones.py`)
  - `numpy` (used by detection wrapper)
- Native / optional:
  - `opencv-python` (provides `cv2`) — required to actually open/process video files. The script defers `cv2` import until runtime so `--help` still works without this native lib.
  - `ultralytics` (YOLOv8) — optional; `pipeline/detect.py` falls back to a no-op detector if unavailable.
  - `bytetrack` (optional) — optional tracker fallback; `pipeline/tracker.py` has a pure-Python `SimpleTracker` used when ByteTrack is not installed.

Install suggestions (example):

```bash
python -m pip install pyyaml numpy opencv-python
# optional (for better detection/tracking):
python -m pip install ultralytics bytetrack
```

Verification Performed

- Ran:

```bash
python3 pipeline/run.py --help
```

Output: argparse help printed successfully. No module import errors or syntax errors.

- Performed module import checks (with `PYTHONPATH` set to repo root) to ensure `pipeline.detect`, `pipeline.tracker`, `pipeline.sessions`, `pipeline.zones`, and `pipeline.events` import without syntax errors.

Notes on running environment
- If you run the script directly as `python pipeline/run.py`, the script inserts the repository root into `sys.path` so package imports resolve. Alternatively, you can run it as a module from the repository root:

```bash
python -m pipeline.run --video sample.mp4 --store 1 --camera CAM1
```

This module-mode avoids manipulating `sys.path` inside the script.

Expected CLI Arguments
- `--video` (required): path to input video file or camera device.
- `--output` (optional): output JSONL path (default: `output/events.jsonl`).
- `--store` (optional): store id (int, default: 1).
- `--camera` (optional): camera id string (default: `CAM1`).
- `--max-frames` (optional): integer to cap processed frames (useful for smoke tests).
- `--entry-line-y` (optional): Y coordinate (pixels) of an entry line for line-crossing entry detection.
- `--entry-direction` (optional): `down` or `up` — direction considered entry when crossing the line (default: `down`).

Example Execution Commands

- Run help:

```bash
python3 pipeline/run.py --help
```

- Run (development smoke test, limit frames) — ensure `opencv-python` is installed and `sample.mp4` exists:

```bash
python3 pipeline/run.py --video sample.mp4 --store 1 --camera CAM1 --max-frames 200 --output output/events.jsonl
```

- Run with explicit PYTHONPATH (if your current working directory is not the repo root):

```bash
PYTHONPATH=$(pwd) python3 pipeline/run.py --video sample.mp4 --store 1 --camera CAM1
```

- Run as module from repository root (recommended):

```bash
cd /path/to/purplle-store-intelligence
python -m pipeline.run --video sample.mp4 --store 1 --camera CAM1
```

Validation checklist
- `python pipeline/run.py --help`: OK
- `python -m pipeline.run --help`: OK
- `python pipeline/run.py --video sample.mp4 --max-frames 10`: will run if `opencv-python` installed and `sample.mp4` accessible.

If you want, I can:
- Add a small `requirements-pipeline.txt` listing the minimal packages for running the pipeline.
- Add quick smoke test harness that runs the pipeline on a synthetic or very small sample (no video) to validate end-to-end flow.

Prepared by: Senior Python engineer (automated changes limited to syntax/import/control-flow fixes)
