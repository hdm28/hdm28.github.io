function w = halfwidth(a,b,node)
w = ((0.1-b)/(a-0.272)) .* (node-a) + 0.1;
end