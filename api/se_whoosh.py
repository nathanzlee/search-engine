import os 
import json
import jieba
from whoosh.index import create_in, open_dir, exists_in
from whoosh.fields import *
from whoosh import scoring
from whoosh.qparser import QueryParser, OrGroup
from whoosh.qparser import MultifieldParser

def searchQuery(query):
    print("Query: ", query)
    json_dir = "legal_data_10k"
    index_dir = "legal_data_10k"
    top_k = 20
    keyword = query
    tokenized_keyword = ' '.join(jieba.cut_for_search(keyword))

    if exists_in(index_dir):
        ix = open_dir(index_dir)
    else: 
        # Define a schema for the index
        schema = Schema(id=TEXT(stored=True), content=TEXT(stored=True), original_text=TEXT(stored=True), just_text=TEXT(stored=True))

        # Create the index in a directory and open the index
        ix = create_in(index_dir, schema)

        # Get a writer for the index
        writer = ix.writer()

        # Add documents to the index
        for name in os.listdir(json_dir):
            if name.endswith('.json'):
                file_path = os.path.join(json_dir, name)
                with open(file_path, 'r', encoding='UTF-8') as f:
                    data = json.load(f)
                    content = json.dumps(data['writ'], ensure_ascii=False)
                    tokenized_all_content = ' '.join(jieba.cut_for_search(content))
                    just_text = json.dumps(data['writ']['QW']['@oValue'], ensure_ascii=False)
                    # just_text = ' '.join(jieba.cut(just_text))
                    print(name)
                    print("type of original_text", type(just_text))
                    writer.add_document(id=name, content=tokenized_all_content, original_text=content, just_text=just_text)

    # Commit changes to the index
    writer.commit(optimize=True)

    def search(sentences):
        words = [keyword]
        for i in tokenized_keyword.split():
            words.append(i)
        
        for word in words:
            highlighted_sentences = [i for i in sentences if re.search(r'\b%s\b' % word, i)]
            if highlighted_sentences:
                return highlighted_sentences
        return [i for i in sentences if re.search(r'\b%s\b' % word, i)]

    # Search the index
    with ix.searcher(weighting=scoring.TF_IDF()) as searcher:
        query = MultifieldParser(["content"], ix.schema).parse(tokenized_keyword)
        results = searcher.search(query, limit=top_k)
        print("matching docoument count: ", len(results))

        relevantDocs = []

        for result in results:
            print(result['id'])
            just_text = result['just_text']
            s = re.split(r'[.?!:]+', just_text)
            highlighted_content = search(s)
            if highlighted_content:
                highlighted_content = highlighted_content[0].replace(keyword, f"<span style='color: #7C2E9A; font-weight: bold;'>{keyword}</span>")
                pattern = r'(.{{0,10}}<span style=\'color: #7C2E9A; font-weight: bold;\'>{}</span>.{{0,50}})'.format(keyword)
                highlighted_content = re.findall(pattern, highlighted_content)

            relevantDocs.append(
                {
                    'id': result['id'],
                    'content': result['original_text'],
                    'matchedText': highlighted_content,
                    'matchedTerms': tokenized_keyword.split()
                }
            )

        # for result in results:
        #     original_text = result['original_text']
        #     s = re.split(r'[.?!:]+', original_text)
        #     highlighted_content = search(s)
        #     if highlighted_content:
        #         highlighted_content = highlighted_content[0].replace(keyword, f"<span style='color: #7C2E9A; font-weight: bold;'>{keyword}</span>")
        #         print("Highlighted: ", highlighted_content)
            
            
    
        formatted_results = {
            'total': len(results),
            'relevantDocs': relevantDocs
        }
        
    return formatted_results
    
    
    
