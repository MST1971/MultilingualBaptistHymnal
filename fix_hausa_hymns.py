
import os

file_path = r'c:\apps\my-baptist-hymnal\src\components\HausaHymnDetail.js'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Locate the misplaced block
start_index = -1
end_index = -1

for i in range(len(lines)):
    if lines[i].strip() == '},' and i + 1 < len(lines) and '"HBH241": {' in lines[i+1]:
        start_index = i
    if lines[i].strip() == '};' and i + 2 < len(lines) and "document.addEventListener('mouseup', handleSelection);" in lines[i+2]:
        end_index = i
        break

if start_index != -1 and end_index != -1:
    print(f"Found misplaced block from line {start_index+1} to {end_index+1}")
    
    block_lines = lines[start_index+1 : end_index] # Extract HBH241...HBH256
    
    # Fix the start line
    lines[start_index] = '    };\n'
    
    # Remove the block and the extra '};'
    del lines[start_index+1 : end_index+1]
    
    # Now insert at the bottom
    # Find the line with "return hausaHymns[hymnId] || null;"
    insert_index = -1
    for i in range(len(lines)-1, 0, -1):
        if "return hausaHymns[hymnId] || null;" in lines[i]:
            # Scan backwards to find the closing '};' of the object
            for j in range(i-1, i-20, -1):
                if lines[j].strip() == '};':
                    insert_index = j
                    break
            break
            
    if insert_index != -1:
        print(f"Found insertion point at line {insert_index+1}")
        
        # Add comma to the previous last item if needed
        prev_line_idx = insert_index - 1
        # Skip empty lines backwards
        while prev_line_idx > 0 and not lines[prev_line_idx].strip():
            prev_line_idx -= 1
            
        if lines[prev_line_idx].strip() == '}':
            lines[prev_line_idx] = lines[prev_line_idx].rstrip() + ',\n'
        elif lines[prev_line_idx].strip().endswith('}'):
             # case where it is '  },' or '  }'
             if not lines[prev_line_idx].strip().endswith(','):
                 lines[prev_line_idx] = lines[prev_line_idx].rstrip() + ',\n'
            
        # Indent and insert
        indented_block = ['    ' + line for line in block_lines]
        lines[insert_index:insert_index] = indented_block
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("File updated successfully.")
    else:
        print("Could not find insertion point.")
else:
    print("Could not find misplaced block.")
