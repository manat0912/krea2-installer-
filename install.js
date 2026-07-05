module.exports = {
  run: [
    // Step 1: Clone the custom app repository
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/manat0912/krea2-app.git app"
        ]
      }
    },
    // Step 2: Install core Python tools and packages
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install gradio devicetorch huggingface_hub",
          "uv pip install -r requirements.txt"
        ]
      }
    },
    // Step 3: Install PyTorch with CUDA using torch.js
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app"
        }
      }
    },
    // Step 4: Download Krea-2 RAW model (un-gated community mirror)
    {
      method: "hf.download",
      params: {
        path: "app",
        "_": [ "Jinstudio/Krea-2-Raw" ],
        "include": [ "raw.safetensors" ],
        "local-dir": "checkpoints",
        "token": "False"
      }
    },
    // Step 5: Download Krea-2 Turbo model (FP8 quantized un-gated mirror from Comfy-Org)
    {
      method: "hf.download",
      params: {
        path: "app",
        "_": [ "Comfy-Org/Krea-2" ],
        "include": [ "diffusion_models/krea2_turbo_fp8_scaled.safetensors" ],
        "local-dir": "checkpoints",
        "token": "False"
      }
    },
    // Step 6: User-requested model download 1 (FasterLivePortrait via Python CLI)
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "python -c \"from huggingface_hub import snapshot_download; snapshot_download('warmshao/FasterLivePortrait', local_dir='./checkpoints', token=False)\""
        ]
      }
    },
    // Step 7: User-requested model download 2 (qwen-image-edit-rapid-aio-sfw-v23 via hf.download)
    {
      method: "hf.download",
      params: {
        path: "app",
        "_": [ "IllyaS08/qwen-image-edit-rapid-aio-sfw-v23" ],
        "repo-type": "space",
        "local-dir": "checkpoints",
        "token": "False"
      }
    }
  ]
}
