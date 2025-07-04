function w = halfwidthQuad(p,r,node)
w = p*(node^2) + calcq(p,r)*(node) + r;
end