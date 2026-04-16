import re

svg_file = '/Users/doanson/Desktop/DS-PRJ/tthcm-app/public/images/vietnam_map.svg'
with open(svg_file, 'r') as f:
    content = f.read()

# Remove old custom_labels if exist
content = re.sub(r'<g id="custom_labels">.*?</g>', '', content, flags=re.DOTALL)

custom_labels = """
  <g id="custom_labels">
    <!-- Hoàng Sa Label -->
    <text x="1145" y="1280" fill="#fff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">QĐ. Hoàng Sa</text>
    <text x="1145" y="1302" fill="#f87171" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">(Việt Nam)</text>

    <!-- Trường Sa Label -->
    <text x="1054" y="2045" fill="#fff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">QĐ. Trường Sa</text>
    <text x="1054" y="2067" fill="#f87171" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">(Việt Nam)</text>
  </g>
</svg>
"""

content = content.replace("</svg>", custom_labels)
with open(svg_file, 'w') as f:
    f.write(content)
print("Pached SVG without frames!")
